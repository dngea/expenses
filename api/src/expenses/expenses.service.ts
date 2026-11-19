import {
  Injectable,
  Inject,
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import pg from 'pg';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { ListExpensesQueryDto } from './dto/list-expenses-query.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';

const EXPENSE_WITH_CATEGORY_QUERY = `
          SELECT 
              expenses.id, 
              expenses.amount,
              expenses.spent_at,
              expenses.description,
              categories.name AS category_name,
              expenses.category_id
          FROM expenses 
          JOIN categories ON expenses.category_id = categories.id`;

const ORDER_BY_EXPENSE_DATE = `ORDER BY expenses.spent_at DESC, expenses.id DESC`;

const SUMMARY_SELECT_TOTAL = `
        SELECT 
          categories.id AS category_id,
          categories.name AS category_name,
          SUM(expenses.amount) AS total
        FROM 
          categories
        JOIN
          expenses ON expenses.category_id = categories.id
        `;

const SUMMARY_GROUP_AND_ORDER = `
        GROUP BY
          categories.id   
        ORDER BY 
          total DESC, categories.id ASC
          `;

const notFoundCategoryMessage = (category_id: number) =>
  `Category with id: ${category_id} does not exist`;

@Injectable()
export class ExpensesService {
  private readonly pool: pg.Pool; // sin asignar valor aun, no tiene "= blabla"

  constructor(@Inject(pg.Pool) pool: pg.Pool) {
    this.pool = pool;
  }

  private validatePeriod(from?: string, to?: string) {
    // missing one of them
    if (!from || !to) {
      throw new BadRequestException(
        'Missing one of the period params (from, to)',
      );
    }

    // valid period of time
    if (from > to) {
      throw new BadRequestException('from must be on or before to');
    }
  }

  async getAll(query: ListExpensesQueryDto) {
    // both missing
    if (!query.from && !query.to) {
      const result = await this.pool.query(
        `
          ${EXPENSE_WITH_CATEGORY_QUERY}
          ${ORDER_BY_EXPENSE_DATE}
          `,
      );
      return result.rows;
    }

    this.validatePeriod(query.from, query.to);

    const result = await this.pool.query(
      `
        ${EXPENSE_WITH_CATEGORY_QUERY}
        WHERE 
          expenses.spent_at >= $1
          AND expenses.spent_at <= $2
        ${ORDER_BY_EXPENSE_DATE}
        `,
      [query.from, query.to],
    );

    return result.rows;
  }

  async getOne(id: number) {
    const result = await this.pool.query(
      `
      ${EXPENSE_WITH_CATEGORY_QUERY}
      WHERE expenses.id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`The expense with id ${id} does not exist`);
    }
    return result.rows[0];
  }

  async createOne(data: CreateExpenseDto) {
    const { category_id, amount, spent_at, description } = data;

    try {
      const result = await this.pool.query(
        `
        INSERT INTO 
          expenses (category_id, amount, spent_at, description)
        VALUES 
          ($1, $2, $3, $4)
        RETURNING 
          id
        `,
        [category_id, amount, spent_at, description],
      );

      return this.getOne(result.rows[0].id);
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23503') {
        throw new UnprocessableEntityException(
          notFoundCategoryMessage(category_id),
        );
      }
      throw error;
    }
  }

  async getSummary(query: ListExpensesQueryDto) {
    // if (from and to) missing, return all
    if (!query.from && !query.to) {
      const result = await this.pool.query(`
        ${SUMMARY_SELECT_TOTAL}
        ${SUMMARY_GROUP_AND_ORDER} 
        `);

      return result.rows;
    }

    this.validatePeriod(query.from, query.to);

    const result = await this.pool.query(
      `
        ${SUMMARY_SELECT_TOTAL}
        WHERE 
          expenses.spent_at >= $1
          AND expenses.spent_at <= $2
        ${SUMMARY_GROUP_AND_ORDER} 
        `,
      [query.from, query.to],
    );

    return result.rows;
  }

  async updateOne(id: number, input: UpdateExpenseDto) {
    const entry = await this.getOne(id);

    // no need to return or check if entry exist, it would throw error in getOne()

    const updated = {
      amount: input.amount ?? entry.amount,
      spent_at: input.spent_at ?? entry.spent_at,
      category_id: input.category_id ?? entry.category_id,
      description: input.description ?? entry.description,
    };

    try {
      await this.pool.query(
        `
        UPDATE 
          expenses 
        SET 
          amount = $2, 
          spent_at = $3, 
          category_id= $4, 
          description = $5
        WHERE
          expenses.id = $1
        
        `,
        [
          id,
          updated.amount,
          updated.spent_at,
          updated.category_id,
          updated.description,
        ],
      );

      return this.getOne(id);
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23503') {
        throw new UnprocessableEntityException(
          notFoundCategoryMessage(updated.category_id),
        );
      }

      throw error;
    }
  }

  async deleteOne(id: number) {
    await this.getOne(id);

    await this.pool.query(
      `
      DELETE FROM expenses
      WHERE expenses.id = $1
      `,
      [id],
    );
  }
}

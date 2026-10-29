import {
  Injectable,
  Inject,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import pg from 'pg';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
} from './dto/create-expense.dto.js';
import { ListExpensesQueryDto } from './dto/list-expenses-query.dto.js';
import { throwError } from 'rxjs';

@Injectable()
export class ExpensesService {
  private readonly pool: pg.Pool; // sin asignar valor aun, no tiene "= blabla"

  constructor(@Inject(pg.Pool) pool: pg.Pool) {
    this.pool = pool;
  }

  async getAll(query: ListExpensesQueryDto) {
    if (!query.month) {
      const getResponse = await this.pool.query(
        `
          SELECT 
              expenses.id, 
              expenses.amount,
              expenses.spent_at,
              expenses.description,
              categories.name AS category_name,
              expenses.category_id
          FROM expenses 
          JOIN categories ON expenses.category_id = categories.id
          ORDER BY expenses.spent_at DESC, expenses.id DESC
          `,
      );
      const result = getResponse.rows;
      return result;
    }

    const getResponseQuery = await this.pool.query(
      `
        SELECT 
            expenses.id, 
            expenses.amount,
            expenses.spent_at,
            expenses.description,
            categories.name AS category_name,
            expenses.category_id
        FROM expenses 
        JOIN categories ON expenses.category_id = categories.id
        WHERE TO_CHAR(expenses.spent_at, 'YYYY-MM') = $1
        ORDER BY expenses.spent_at DESC, expenses.id DESC
        `,
      [query.month],
    );

    return getResponseQuery.rows;
  }

  async getOne(id: number) {
    const result = await this.pool.query(
      `
      SELECT 
        expenses.id,
        expenses.amount,
        expenses.category_id,
        expenses.spent_at,
        expenses.description,
        categories.name AS category_name
      FROM expenses
      JOIN categories ON expenses.category_id = categories.id
      WHERE expenses.id = $1
      `,
      [id],
    );

    // is array empty ?
    if (result.rows.length === 0) {
      throw new NotFoundException(`The expense with id ${id} does not exist`);
    }
    return result.rows[0];
  }

  async createOne(data: CreateExpenseDto) {
    const { category_id, amount, spent_at, description } = data;

    try {
      const insertResponse = await this.pool.query(
        `
        INSERT INTO 
        expenses (category_id, amount, spent_at, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [category_id, amount, spent_at, description],
      );

      const result = insertResponse.rows[0];

      return result;
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23503') {
        throw new UnprocessableEntityException(
          `Category with id: ${category_id} does not exist`,
        );
      }
      throw error;
    }
  }

  async getSummary(query: ListExpensesQueryDto) {
    const hasQuery = !!query.month;

    if (!hasQuery) {
      const getResponse = await this.pool.query(
        `
        SELECT 
          categories.id AS category_id,
          categories.name AS category_name,
          SUM(expenses.amount) AS total
        FROM 
          categories
        JOIN
          expenses ON expenses.category_id = categories.id
        GROUP BY
          categories.id   
        ORDER BY 
          total DESC, categories.id asc    
        `,
      );

      return getResponse.rows;
    }

    const getResponseQuery = await this.pool.query(
      `
        SELECT 
          categories.id AS category_id,
          categories.name AS category_name,
          SUM(expenses.amount) AS total
        FROM 
          categories
        JOIN
          expenses ON expenses.category_id = categories.id
        WHERE 
          TO_CHAR(expenses.spent_at, 'YYYY-MM') = $1
        GROUP BY
          categories.id   
        ORDER BY 
          total DESC, categories.id asc 
        `,
      [query.month],
    );

    return getResponseQuery.rows;
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
      const response = await this.pool.query(
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
        RETURNING *
        `,
        [
          id,
          updated.amount,
          updated.spent_at,
          updated.category_id,
          updated.description,
        ],
      );

      return response.rows[0];
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23503') {
        throw new UnprocessableEntityException(
          `Category id ${updated.category_id} does not exist in categories`,
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

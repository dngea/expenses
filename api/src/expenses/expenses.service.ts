import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import pg from 'pg';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { ListExpensesQueryDto } from './dto/list-expenses-query.dto.js';

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
      console.error('error >>', error);
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
}

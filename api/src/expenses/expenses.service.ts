import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import pg from 'pg';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ExpensesService {
  private readonly pool: pg.Pool; // sin asignar valor aun, no tiene "= blabla"

  constructor(@Inject(pg.Pool) pool: pg.Pool) {
    this.pool = pool;
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
}

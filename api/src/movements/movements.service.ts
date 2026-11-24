import {
  Injectable,
  Inject,
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import pg from 'pg';
import { CreateMovementDto } from './dto/create-movement.dto.js';
import { ListMovementsQueryDto } from './dto/list-movement-query.dto.js';
import { UpdateMovementDto } from './dto/update-movement.dto.js';

const MOVEMENT_WITH_CATEGORY_QUERY = `
          SELECT 
              movements.id, 
              movements.amount,
              movements.spent_at,
              movements.description,
              categories.name AS category_name,
              movements.category_id
          FROM movements 
          JOIN 
            categories ON movements.category_id = categories.id 
            `;

const ORDER_BY_MOVEMENT_DATE = `ORDER BY movements.spent_at DESC, movements.id DESC`;

const SUMMARY_SELECT_TOTAL = `
        SELECT 
          categories.id AS category_id,
          categories.name AS category_name,
          SUM(movements.amount) AS total
        FROM 
          categories
        JOIN
          movements ON movements.category_id = categories.id
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
export class MovementsService {
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

  async getAll(query: ListMovementsQueryDto) {
    // both missing
    if (!query.from && !query.to) {
      const result = await this.pool.query(
        `
          ${MOVEMENT_WITH_CATEGORY_QUERY}
          WHERE categories.type = $1 
          ${ORDER_BY_MOVEMENT_DATE}
          `,
        [query.type],
      );
      return result.rows;
    }

    this.validatePeriod(query.from, query.to);

    const result = await this.pool.query(
      `
        ${MOVEMENT_WITH_CATEGORY_QUERY}
        WHERE 
          movements.spent_at >= $2
          AND movements.spent_at <= $3
          AND categories.type = $1 
        ${ORDER_BY_MOVEMENT_DATE}
        `,
      [query.type, query.from, query.to],
    );

    return result.rows;
  }

  async getOne(id: number) {
    const result = await this.pool.query(
      `
      ${MOVEMENT_WITH_CATEGORY_QUERY}
      WHERE movements.id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`The movement with id ${id} does not exist`);
    }
    return result.rows[0];
  }

  async createOne(data: CreateMovementDto) {
    const { category_id, amount, spent_at, description } = data;

    try {
      const result = await this.pool.query(
        `
        INSERT INTO 
          movements (category_id, amount, spent_at, description)
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

  async getSummary(query: ListMovementsQueryDto) {
    // if (from and to) missing, return all
    if (!query.from && !query.to) {
      const result = await this.pool.query(
        `
        ${SUMMARY_SELECT_TOTAL}
        WHERE categories.type = $1
        ${SUMMARY_GROUP_AND_ORDER} 
        `,
        [query.type],
      );

      return result.rows;
    }

    this.validatePeriod(query.from, query.to);

    const result = await this.pool.query(
      `
        ${SUMMARY_SELECT_TOTAL}
        WHERE 
          categories.type = $1
          AND movements.spent_at >= $2
          AND movements.spent_at <= $3
        ${SUMMARY_GROUP_AND_ORDER} 
        `,
      [query.type, query.from, query.to],
    );

    return result.rows;
  }

  async getBalance() {
    const result = await this.pool.query(
      `
      SELECT 
        total_incomes - total_expenses AS balance
      FROM (
        SELECT 
          COALESCE(SUM(movements.amount) FILTER (WHERE categories.type = 'income'), 0) as total_incomes,
          COALESCE(SUM(movements.amount) FILTER (WHERE categories.type = 'expense'), 0) as total_expenses
        FROM movements JOIN categories ON movements.category_id = categories.id
      ) AS totals
      `,
    );

    return result.rows[0];
  }

  async updateOne(id: number, input: UpdateMovementDto) {
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
          movements 
        SET 
          amount = $2, 
          spent_at = $3, 
          category_id= $4, 
          description = $5
        WHERE
          movements.id = $1
        
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
      DELETE FROM movements
      WHERE movements.id = $1
      `,
      [id],
    );
  }
}

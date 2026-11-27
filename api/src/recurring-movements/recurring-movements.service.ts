import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import pg from 'pg';
import { CreateRecurringMovementDto } from './dto/create-recurring-movements.dto.js';
import {
  notFoundCategoryMessage,
  START_END_DATES_ERROR_MESSAGE,
} from '../common/messages.js';
import { UpdateRecurringMovementsDto } from './dto/update-recurring-movements.dto.js';

const RECURRING_MOVEMENTS_JOIN_CATEGORIES_QUERY = `
        SELECT 
            recurring_movements.id,
            recurring_movements.category_id,
            recurring_movements.amount,
            recurring_movements.start_date,
            recurring_movements.end_date,
            recurring_movements.day_of_repeat,
            recurring_movements.description,
            categories.name AS category_name,
            categories.icon AS category_icon,
            categories.color AS category_color
        FROM recurring_movements
        JOIN categories ON recurring_movements.category_id = categories.id`;

@Injectable()
export class RecurringMovementsService {
  constructor(@Inject(pg.Pool) private readonly pool: pg.Pool) {}

  async getOne(id: number) {
    const result = await this.pool.query(
      `
        ${RECURRING_MOVEMENTS_JOIN_CATEGORIES_QUERY}
        WHERE recurring_movements.id = $1
        `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Recurring movement with id: ${id} does not exist`,
      );
    }

    return result.rows[0];
  }

  async getAll() {
    const result = await this.pool.query(`
        ${RECURRING_MOVEMENTS_JOIN_CATEGORIES_QUERY}
        ORDER BY amount DESC, categories.name ASC, recurring_movements.id DESC
        `);
    return result.rows;
  }

  async createOne(body: CreateRecurringMovementDto) {
    const {
      amount,
      category_id,
      start_date,
      end_date,
      day_of_repeat,
      description,
    } = body;

    if (end_date && end_date < start_date)
      throw new BadRequestException(START_END_DATES_ERROR_MESSAGE);

    try {
      const result = await this.pool.query(
        `
            INSERT INTO recurring_movements (amount, category_id, start_date, end_date, day_of_repeat, description)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING recurring_movements.id
        `,
        [amount, category_id, start_date, end_date, day_of_repeat, description],
      );

      return await this.getOne(result.rows[0].id);
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23503') {
        throw new UnprocessableEntityException(
          notFoundCategoryMessage(category_id),
        );
      }

      throw error;
    }
  }

  async updateOne(id: number, body: UpdateRecurringMovementsDto) {
    const existing = await this.getOne(id);

    const updated = {
      amount: body.amount ?? existing.amount,
      category_id: body.category_id ?? existing.category_id,
      start_date: body.start_date ?? existing.start_date,
      end_date: body.end_date === undefined ? existing.end_date : body.end_date,
      day_of_repeat: body.day_of_repeat ?? existing.day_of_repeat,
      description: body.description ?? existing.description,
    };

    if (updated.end_date && updated.end_date < updated.start_date) {
      throw new BadRequestException(START_END_DATES_ERROR_MESSAGE);
    }

    try {
      await this.pool.query(
        `
            UPDATE recurring_movements
            SET 
                amount = $1,
                category_id = $2,
                start_date = $3,
                end_date = $4,
                day_of_repeat = $5,
                description = $6
            WHERE recurring_movements.id = $7
            `,
        [
          updated.amount,
          updated.category_id,
          updated.start_date,
          updated.end_date,
          updated.day_of_repeat,
          updated.description,
          id,
        ],
      );

      return await this.getOne(id);
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
    // check if exists
    await this.getOne(id);

    await this.pool.query(
      `
        DELETE FROM recurring_movements
        WHERE recurring_movements.id = $1
        `,
      [id],
    );
  }

  async generateMovements() {
    // iterate
    // get all recurring movements with important new fields
    // for (const recurring of recurringMovements) {
    // to -> the least number between today and end_date
    // from -> the next day after the last generated, or start_date

    const rules = (
      await this.pool.query(
        `
      SELECT
         *,
         LEAST(end_date, CURRENT_DATE) AS to_date,
         COALESCE(generated_until + 1, start_date) AS from_date
      FROM recurring_movements
      `,
      )
    ).rows;

    for (const rule of rules) {
      if (rule.from_date > rule.to_date) continue;
    }

    // }

    // is generated until less than today or less than end date if has it
    // generate movement using post createOne in movements (fill fields of id, date of rcurring movement)
  }
}

const normalizeDay = (day: number, from: string, to: string) => {
  if (day <= 28) return day;
};

const occurrenceDate = (year: number, month: number, day: number) => {
  const totalDays = daysInMonth(year, month);
  const occurrenceDay = Math.min(totalDays, day);

  return `${year}-${String(month).padStart(2, '0')}-${String(occurrenceDay).padStart(2, '0')}`;
};

const daysInMonth = (year: number, month: number): number => {
  //January starts on 0
  const total = new Date(year, month, 0).getDate();

  return total;
};

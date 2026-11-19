import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import pg from 'pg';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

// El servicio, se ocupa:
// de la Lógica, los datos,
// buscar, validar y guardar
// devuelve "DATOS"

const categoryExistsMessage = (name: string) =>
  `Category with name ${name} already exists`;

@Injectable()
export class CategoriesService {
  // this here:
  // constructor(@Inject(pg.Pool) private readonly pool: pg.Pool) {}

  // is the same as
  // --
  private readonly pool: pg.Pool;

  constructor(@Inject(pg.Pool) pool: pg.Pool) {
    this.pool = pool;
  }
  // --

  async getAll() {
    const result = await this.pool.query(
      'SELECT * FROM categories ORDER BY id',
    );
    return result.rows;
  }

  async getOne(id: number) {
    const result = await this.pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id],
    );

    const category = result.rows[0];

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);

    return category;
  }

  async createOne(body: CreateCategoryDto) {
    const result = await this.pool.query(
      'SELECT * FROM categories WHERE LOWER(name) = LOWER($1)',
      [body.name],
    );
    const existingCategory = result.rows[0];

    if (existingCategory) {
      throw new ConflictException(categoryExistsMessage(body.name));
    }

    try {
      const insertResult = await this.pool.query(
        'INSERT INTO categories (name, icon, color) VALUES ($1, $2, $3) RETURNING *',
        [body.name, body.icon, body.color],
      );

      return insertResult.rows[0];
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23505') {
        throw new ConflictException(categoryExistsMessage(body.name));
      }

      // rethrow error
      throw error;
    }
  }

  async deleteOne(id: number) {
    await this.getOne(id); // if does not exist, throws error

    try {
      await this.pool.query('DELETE FROM categories WHERE id = $1', [id]);
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23503') {
        throw new ConflictException(
          `This category has associated expenses and cannot be deleted`,
        );
      }

      throw error;
    }
  }

  async deleteOneWithExpenses(id: number) {
    // check id exists
    await this.getOne(id);

    const client = await this.pool.connect();

    try {
      await client.query(`BEGIN`);

      // delete expenses associated
      await client.query(
        `
        DELETE FROM expenses
        WHERE expenses.category_id = $1
        `,
        [id],
      );

      // delete category
      await client.query(
        `
          DELETE FROM categories
          WHERE categories.id = $1
          `,
        [id],
      );

      await client.query(`COMMIT`);
    } catch (error) {
      await client.query(`ROLLBACK`);
      throw error;
    } finally {
      // return connection to pool
      client.release();
    }
  }

  async updateOne(id: number, body: UpdateCategoryDto) {
    await this.getOne(id);

    const categoryWithSameName = (
      await this.pool.query(
        'SELECT * FROM categories WHERE LOWER(name) = LOWER($1)',
        [body.name],
      )
    ).rows[0];

    if (categoryWithSameName && categoryWithSameName.id !== id)
      throw new ConflictException(categoryExistsMessage(body.name));

    try {
      const categoryEdited = (
        await this.pool.query(
          `UPDATE categories
           SET name = $1, icon = $2, color = $3 
           WHERE id = $4 RETURNING *`,
          [body.name, body.icon, body.color, id],
        )
      ).rows[0];

      return categoryEdited;
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23505') {
        throw new ConflictException(categoryExistsMessage(body.name));
      }

      throw error;
    }
  }
}

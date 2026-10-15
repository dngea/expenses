import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import pg from 'pg';

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

  async createOne(name: string) {
    const result = await this.pool.query(
      'SELECT * FROM categories WHERE LOWER(name) = LOWER($1)',
      [name],
    );
    const existingCategory = result.rows[0];

    if (existingCategory) {
      throw new ConflictException(categoryExistsMessage(name));
    }

    try {
      const insertResult = await this.pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING *',
        [name],
      );

      return insertResult.rows[0];
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23505') {
        throw new ConflictException(categoryExistsMessage(name));
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

  async updateOne(id: number, name: string) {
    await this.getOne(id);

    const categoryWithSameName = (
      await this.pool.query(
        'SELECT * FROM categories WHERE LOWER(name) = LOWER($1)',
        [name],
      )
    ).rows[0];

    if (categoryWithSameName && categoryWithSameName.id !== id)
      throw new ConflictException(categoryExistsMessage(name));

    try {
      const categoryEdited = (
        await this.pool.query(
          'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
          [name, id],
        )
      ).rows[0];

      return categoryEdited;
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23505') {
        throw new ConflictException(categoryExistsMessage(name));
      }

      throw error;
    }
  }
}

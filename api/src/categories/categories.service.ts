import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import pg from 'pg';

// El servicio, se ocupa:
// de la Lógica, los datos,
// buscar, validar y guardar
// devuelve "DATOS"

@Injectable()
export class CategoriesService {
  private categories = [
    { id: 1, name: 'Comida' },
    { id: 2, name: 'Transporte' },
  ];

  private pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  async getAll() {
    // return this.categories;
    const result = await this.pool.query('SELECT * FROM categories');
    return result.rows;
  }

  async getOne(id: number) {
    // const category = this.categories.find((c) => c.id === id);
    const result = await this.pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id],
    );

    const category = result.rows[0];

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);

    return category;
  }

  createOne(name: string) {
    const existingCategory = this.categories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );

    if (existingCategory) {
      throw new ConflictException(`Category with name ${name} already exists`);
    }

    const ids = this.categories.map((cat) => cat.id);
    const highestId = Math.max(...ids, 0);

    const newCategory = { id: highestId + 1, name };

    this.categories.push(newCategory);

    return newCategory;
  }

  deleteOne(id: number) {
    const existingCategory = this.categories.find((c) => c.id === id);

    if (!existingCategory)
      throw new NotFoundException(`Category doesn't exist`);

    const index = this.categories.findIndex((c) => c.id === id);

    this.categories.splice(index, 1);
  }

  // async updateOne(id: number, name: string) {
  //   const categoryToEdit = await this.getOne(id); // inside getOne throws error if cat not defined

  //   const categoryWithSameName = this.categories.find(
  //     (c) => c.name.toLowerCase() === name.toLowerCase(),
  //   );

  //   if (categoryWithSameName && categoryWithSameName.id !== id)
  //     throw new ConflictException(`Category with name ${name} already exists`);

  //   categoryToEdit.name = name;

  //   return categoryToEdit;
  // }
}

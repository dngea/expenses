import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  private categories = [
    { id: 1, name: 'Comida' },
    { id: 2, name: 'Transporte' },
  ];

  getAll() {
    return this.categories;
  }

  getService(id: number) {
    return this.categories.find((c) => c.id === id);
  }
}

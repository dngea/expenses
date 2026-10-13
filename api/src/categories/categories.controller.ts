import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { CategoriesService } from './categories.service.js';

// el controlador se encarga del HTTP:
// qué ruta maneja,
// qué parámetros llegan
// qué responde

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAll() {
    return this.categoriesService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.categoriesService.getOne(Number(id));
  }

  @Post()
  createOne(@Body('name') name: string) {
    return this.categoriesService.createOne(name);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteOne(@Param('id') id: string) {
    this.categoriesService.deleteOne(Number(id));
  }

  @Patch(':id')
  editOne(@Param('id') id: string, @Body('name') name: string) {
    return this.categoriesService.updateOne(Number(id), name);
  }
}

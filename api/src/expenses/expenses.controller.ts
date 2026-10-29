import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  Delete,
  HttpCode,
} from '@nestjs/common';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
} from './dto/create-expense.dto.js';
import { ExpensesService } from './expenses.service.js';
import { ListExpensesQueryDto } from './dto/list-expenses-query.dto.js';

@Controller('expenses')
export class ExpensesController {
  private readonly expensesService: ExpensesService;

  constructor(expensesService: ExpensesService) {
    this.expensesService = expensesService;
  }

  @Get()
  getAll(@Query() query: ListExpensesQueryDto) {
    return this.expensesService.getAll(query);
  }

  @Get('summary')
  getSummary(@Query() query: ListExpensesQueryDto) {
    return this.expensesService.getSummary(query);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.getOne(id);
  }

  @Post()
  createOne(@Body() body: CreateExpenseDto) {
    return this.expensesService.createOne(body);
  }

  @Patch(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateExpenseDto,
  ) {
    return this.expensesService.updateOne(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.deleteOne(id);
  }
}

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
  UseGuards,
} from '@nestjs/common';
import { CreateMovementDto } from './dto/create-movement.dto.js';
import { MovementsService } from './movements.service.js';
import { ListMovementsQueryDto } from './dto/list-movement-query.dto.js';
import { UpdateMovementDto } from './dto/update-movement.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('movements')
export class MovementsController {
  private readonly movementsService: MovementsService;

  constructor(movementsService: MovementsService) {
    this.movementsService = movementsService;
  }

  @Get()
  getAll(@Query() query: ListMovementsQueryDto) {
    return this.movementsService.getAll(query);
  }

  @Get('summary')
  getSummary(@Query() query: ListMovementsQueryDto) {
    return this.movementsService.getSummary(query);
  }

  @Get('balance')
  getBalance() {
    return this.movementsService.getBalance();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.movementsService.getOne(id);
  }

  @Post()
  createOne(@Body() body: CreateMovementDto) {
    return this.movementsService.createOne(body);
  }

  @Patch(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMovementDto,
  ) {
    return this.movementsService.updateOne(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.movementsService.deleteOne(id);
  }
}

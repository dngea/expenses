import { Inject, Injectable } from '@nestjs/common';
import pg from 'pg';

@Injectable()
export class HealthService {
  constructor(@Inject(pg.Pool) private readonly pool: pg.Pool) {}

  async healthCheck() {
    await this.pool.query(`SELECT 1`);

    return { status: 'ok' };
  }
}

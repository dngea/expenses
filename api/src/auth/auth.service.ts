import { Injectable, Inject } from '@nestjs/common';
import pg from 'pg';

@Injectable()
export class AuthService {
  constructor(@Inject(pg.Pool) private readonly pool: pg.Pool) {}
}

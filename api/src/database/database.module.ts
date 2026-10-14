import { Module } from '@nestjs/common';
import pg from 'pg';

@Module({
  providers: [
    {
      provide: pg.Pool,
      useFactory: () =>
        new pg.Pool({
          connectionString: process.env.DATABASE_URL,
        }),
    },
  ],
  exports: [pg.Pool],
})
export class DatabaseModule {}

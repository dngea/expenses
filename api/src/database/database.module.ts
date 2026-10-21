import { Module } from '@nestjs/common';
import pg from 'pg';

@Module({
  providers: [
    {
      provide: pg.Pool,
      useFactory: () => {
        pg.types.setTypeParser(1082, (value) => value);
        return new pg.Pool({
          connectionString: process.env.DATABASE_URL,
        });
      },
    },
  ],
  exports: [pg.Pool],
})
export class DatabaseModule {}

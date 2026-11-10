import {
  Injectable,
  Inject,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import pg from 'pg';
import { RegisterUserDto } from './dto/register.dto.js';
import bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

const CLOSED_REGISTRATION_MESSAGE = `Registration is closed`;
const INVALID_EMAIL_PASSWORD_MESSAGE = 'Invalid email or password';

@Injectable()
export class AuthService {
  constructor(
    @Inject(pg.Pool) private readonly pool: pg.Pool,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: RegisterUserDto) {
    // check if there are users
    const check = await this.pool.query(`
            SELECT users.email
            FROM users
            LIMIT 1
            `);

    if (check.rows.length > 0) {
      throw new ForbiddenException(CLOSED_REGISTRATION_MESSAGE);
    }

    const hashed_password = await bcrypt.hash(body.password, 10);

    try {
      const result = await this.pool.query(
        `
                INSERT INTO 
                    users (username, email, password_hash)
                VALUES 
                    ($1, $2, $3)
                RETURNING   
                    id, username, email
                `,
        [body.username, body.email, hashed_password],
      );

      return result.rows[0];
    } catch (error) {
      if (error instanceof pg.DatabaseError && error.code === '23505') {
        throw new ForbiddenException(CLOSED_REGISTRATION_MESSAGE);
      }

      throw error;
    }
  }

  async login(body: LoginUserDto) {
    const check = await this.pool.query(
      `
        SELECT users.email, users.password_hash, users.id
        FROM users
        WHERE users.email = $1
        `,
      [body.email],
    );

    if (check.rows.length !== 1) {
      throw new UnauthorizedException(INVALID_EMAIL_PASSWORD_MESSAGE);
    }

    const passwordMatches = await bcrypt.compare(
      body.password,
      check.rows[0].password_hash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_EMAIL_PASSWORD_MESSAGE);
    }

    const user = check.rows[0];

    const accessToken = await this.jwtService.signAsync({ sub: user.id });

    return { access_token: accessToken };
  }
}

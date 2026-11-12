import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';
import { LoginUserDto } from './dto/login.dto.js';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard.js';

interface AuthenticatedRequest extends Request {
  user: { id: number };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(204)
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.login(body);

    res.cookie('token', response.access_token, {
      // js can't read it
      httpOnly: true,
      //use https in production
      secure: process.env.NODE_ENV === 'production',
      // protection against CSRF
      sameSite: 'lax',
      // miliseconds
      maxAge: 1500 * 1000,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.authService.me(userId);
  }
}

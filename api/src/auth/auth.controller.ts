import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';
import { LoginUserDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }
}

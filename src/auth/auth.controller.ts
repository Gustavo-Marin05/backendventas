import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/create-auth.dto';
import { AuthGuard } from './guard/auth.guard';
import { Response as Res } from 'express';
import { LoginUserDto } from './dto/login-auth.dto';
import { clearTokenCookie, setTokenCookie } from './cookie';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() user: LoginUserDto, @Response({ passthrough: true }) res: Res) {
    const result = await this.authService.loginService(user.email, user.password);

    setTokenCookie(res, result.acces_token);

    return { message: 'Login exitoso' };
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() user: RegisterUserDto, @Response({ passthrough: true }) res: Res) {
    const result = await this.authService.registerService(user);

  

   setTokenCookie(res, result.acces_token);

    return { message: 'Usuario registrado y autenticado' };
  }





  
  @Get('users')
  async getUsers() {
    return this.authService.getUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async profileController(@Request() req) {
    return req.user;
  }

  @Post('logout')
  logout(@Response({ passthrough: true }) res: Res) {
    clearTokenCookie(res);
    return { message: 'Sesión cerrada' };
  }
}
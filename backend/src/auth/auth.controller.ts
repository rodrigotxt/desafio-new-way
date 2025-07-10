// src/auth/auth.controller.ts
import { Controller, Post, Request, UseGuards, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';

import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica um usuário e retorna um token de acesso' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login bem-sucedido, retorna o token JWT',
    schema: {
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Credenciais inválidas' })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('profile')

  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('logout')
  logout(@Request() req) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('createUser')
  createUser(@Request() req, @Body() userDto: UserDto) {
    return this.authService.createUser(req.body);
  }
}
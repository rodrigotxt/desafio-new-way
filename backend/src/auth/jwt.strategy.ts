// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service'; // Importe UsersService
import { User } from '../users/entities/user.entity'; // Importe User entity

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Buscar o usuário no banco de dados para obter o nível mais recente
    const user: User | null = await this.usersService.findOne(payload.username);

    if (!user) {
      // Se o usuário não for encontrado no DB, o token é inválido.
      return null;
    }

    return { userId: user.userId, username: user.username, level: user.level };
  }
}
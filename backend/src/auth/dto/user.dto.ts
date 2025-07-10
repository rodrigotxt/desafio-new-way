// src/auth/dto/user.dto.ts
import { ApiProperty } from '@nestjs/swagger'; // Importe ApiProperty
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UserDto {
    @ApiProperty({
      description: 'Nome de usuário para autenticação.',
      example: 'admin',
    })
    @IsString({ message: 'O nome de usuário deve ser uma string.' })
    @IsNotEmpty({ message: 'O nome de usuário não pode estar vazio.' })
    username: string;

    @ApiProperty({
      description: 'Senha do usuário para autenticação.',
      example: 'a1b2c3d4',
      format: 'password',
    })
    @IsString({ message: 'A senha deve ser uma string.' })
    @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
    password: string;

    @ApiProperty({
      description: 'Nível de acesso do usuário.',
      example: 'admin',
    })
    @IsString({ message: 'O nível de acesso deve ser uma string.' })
    @IsOptional()
    level: string;
}
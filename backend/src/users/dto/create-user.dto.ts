// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome de usuário único para o novo usuário.',
    example: 'joao.silva',
    minLength: 3,
  })
  @IsString({ message: 'O nome de usuário deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome de usuário não pode estar vazio.' })
  @MinLength(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres.' })
  username: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres).',
    example: 'minhaSenhaForte123',
    minLength: 6,
    format: 'password',
  })
  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @ApiProperty({
    description: 'Endereço de e-mail do usuário (opcional).',
    example: 'joao.silva@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Por favor, forneça um endereço de e-mail válido.' })
  email?: string;
}
// src/tarefas/dto/create-tarefa.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateTarefaDto {
  @ApiProperty({
    description: 'Nome ou título da tarefa.',
    example: 'Comprar pão',
    minLength: 3,
  })
  @IsString({ message: 'O nome da tarefa deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da tarefa não pode estar vazio.' })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa (opcional).',
    example: 'Comprar pão francês e integral na padaria da esquina.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'A descrição da tarefa deve ser uma string.' })
  descricao?: string;

  @ApiProperty({
    description: 'Indica se a tarefa está concluída.',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean({ message: 'O status de conclusão deve ser um valor booleano.' })
  concluido?: boolean;

  @ApiProperty({
    description: 'ID do usuário ao qual esta tarefa pertence.',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'O ID do usuário não pode estar vazio.' })
  @IsNumber({}, { message: 'O ID do usuário deve ser um número.' })
  userId: number;
}
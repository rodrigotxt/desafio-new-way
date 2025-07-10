// src/tarefas/tarefas.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TarefasService } from './tarefas.service';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth
} from '@nestjs/swagger';

import { Tarefa as Task } from './entities/tarefa.entity';

@ApiTags('tarefas')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('tarefas')
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova tarefa' })
  @ApiBody({ type: CreateTarefaDto, description: 'Dados para criar uma nova tarefa.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Tarefa criada com sucesso.', type: Task })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados da tarefa inválidos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  
  create(@Body() createTarefaDto: CreateTarefaDto, @Request() req) {
    return this.tarefasService.create(createTarefaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as tarefas' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de tarefas retornada com sucesso.', type: [Task] })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  findAll() {
    return this.tarefasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma tarefa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da tarefa a ser buscada', type: Number, example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tarefa encontrada com sucesso.', type: Task })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarefa não encontrada.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    return this.tarefasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma tarefa existente' })
  @ApiParam({ name: 'id', description: 'ID da tarefa a ser atualizada', type: Number, example: 1 })
  @ApiBody({ type: UpdateTarefaDto, description: 'Dados para atualizar a tarefa.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tarefa atualizada com sucesso.', type: Task })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarefa não encontrada.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados da tarefa inválidos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateTarefaDto: UpdateTarefaDto) {
    return this.tarefasService.update(+id, updateTarefaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma tarefa' })
  @ApiParam({ name: 'id', description: 'ID da tarefa a ser removida', type: Number, example: 1 })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Tarefa removida com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarefa não encontrada.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    return this.tarefasService.remove(+id);
  }
}
// src/tarefas/tarefas.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Request, NotFoundException, ForbiddenException } from '@nestjs/common';
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
import { UserLevel } from '../users/entities/user.entity';

@ApiTags('tarefas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tarefas')
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova tarefa para o usuário autenticado' })
  @ApiBody({ type: CreateTarefaDto, description: 'Dados para criar uma nova tarefa. O userId será inferido do token.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Tarefa criada com sucesso.', type: Task })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados da tarefa inválidos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  create(@Body() createTarefaDto: CreateTarefaDto, @Request() req) {
    if (createTarefaDto.userId && createTarefaDto.userId !== req.user.userId) {
        throw new ForbiddenException('Não é permitido criar tarefas para outros usuários diretamente.');
    }
    createTarefaDto.userId = req.user.userId; // Sobrescreve para garantir que a tarefa é do usuário logado
    return this.tarefasService.create(createTarefaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista tarefas (admin: todas; usuário: apenas as próprias)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de tarefas retornada com sucesso.', type: [Task] })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  findAll(@Request() req) {
    if (req.user.level === UserLevel.admin) {
      return this.tarefasService.findAll(); // Admin vê todas as tarefas
    } else {
      return this.tarefasService.findAllByUserId(req.user.userId); // Usuário vê apenas as suas
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma tarefa pelo ID (admin: qualquer; usuário: apenas suas tarefas)' })
  @ApiParam({ name: 'id', description: 'ID da tarefa a ser buscada', type: Number, example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tarefa encontrada com sucesso.', type: Task })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarefa não encontrada.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão para acessar esta tarefa.' })
  async findOne(@Param('id') id: string, @Request() req) {
    if (req.user.level === UserLevel.admin) {
      return this.tarefasService.findOne(+id); // Admin busca qualquer tarefa
    } else {
      // Usuário busca apenas suas tarefas, verificando a propriedade `userId`
      const tarefa = await this.tarefasService.findOne(+id, req.user.userId);
      if (!tarefa) {
        // Se a tarefa não for encontrada ou não pertencer ao usuário, lança 404/403
        throw new NotFoundException(`Tarefa com ID ${id} não encontrada ou não pertence ao usuário.`);
      }
      return tarefa;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma tarefa existente (admin: qualquer; usuário: apenas suas tarefas)' })
  @ApiParam({ name: 'id', description: 'ID da tarefa a ser atualizada', type: Number, example: 1 })
  @ApiBody({ type: UpdateTarefaDto, description: 'Dados para atualizar a tarefa.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tarefa atualizada com sucesso.', type: Task })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarefa não encontrada.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados da tarefa inválidos.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão para alterar esta tarefa.' })
  async update(@Param('id') id: string, @Body() updateTarefaDto: UpdateTarefaDto, @Request() req) {
    if (req.user.level === UserLevel.admin) {
      // Admin pode atualizar qualquer tarefa, mesmo mudando o userId da tarefa
      return this.tarefasService.update(+id, updateTarefaDto);
    } else {
      // Usuário só pode atualizar suas próprias tarefas
      const tarefaExistente = await this.tarefasService.findOne(+id, req.user.userId); // Busca com userId para garantir permissão
      if (!tarefaExistente) {
        throw new NotFoundException(`Tarefa com ID ${id} não encontrada ou não pertence ao usuário.`);
      }
      // Se o usuário tentar mudar o userId da tarefa para outro, impede.
      if (updateTarefaDto.userId && updateTarefaDto.userId !== req.user.userId) {
          throw new ForbiddenException('Não é permitido atribuir tarefas a outros usuários.');
      }
      // Garante que a tarefa será atualizada para o próprio usuário
      updateTarefaDto.userId = req.user.userId; 
      return this.tarefasService.update(+id, updateTarefaDto, req.user.userId);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma tarefa (admin: qualquer; usuário: apenas suas tarefas)' })
  @ApiParam({ name: 'id', description: 'ID da tarefa a ser removida', type: Number, example: 1 })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Tarefa removida com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarefa não encontrada.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autorizado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão para remover esta tarefa.' })
  async remove(@Param('id') id: string, @Request() req) {
    if (req.user.level === UserLevel.admin) {
      return this.tarefasService.remove(+id); // Admin remove qualquer tarefa
    } else {
      // Usuário só pode remover suas próprias tarefas
      const tarefaExistente = await this.tarefasService.findOne(+id, req.user.userId); // Busca com userId para garantir permissão
      if (!tarefaExistente) {
        throw new NotFoundException(`Tarefa com ID ${id} não encontrada ou não pertence ao usuário.`);
      }
      return this.tarefasService.remove(+id, req.user.userId);
    }
  }
}
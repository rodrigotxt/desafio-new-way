// src/tarefas/tarefas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { Tarefa as Task } from './entities/tarefa.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TarefasService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createTarefaDto: CreateTarefaDto): Promise<Task> {
    // Verificar se o userId existe
    const user = await this.usersRepository.findOne({ where: { userId: createTarefaDto.userId } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${createTarefaDto.userId} não encontrado.`);
    }

    // Criar uma nova instância da tarefa a partir do DTO
    const newTask = this.tasksRepository.create({
      ...createTarefaDto,
      user: user,
    });

    // Salvar a nova tarefa no banco de dados
    return this.tasksRepository.save(newTask);
  }

  async findAll(): Promise<Task[]> {
    // Encontra todas as tarefas, e carrega o usuário relacionado
    return this.tasksRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Task> {
    // Encontra uma tarefa pelo ID, e carrega o usuário relacionado
    const task = await this.tasksRepository.findOne({
      where: { taskId: id },
      relations: ['user'],
    });
    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
    return task;
  }

  async update(id: number, updateTarefaDto: UpdateTarefaDto): Promise<Task> {
    // Buscar a tarefa existente
    const task = await this.tasksRepository.findOne({ where: { taskId: id } });
    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }

    // Se um novo userId for fornecido, verificar se o novo usuário existe
    if (updateTarefaDto.userId && updateTarefaDto.userId !== task.userId) {
      const newUser = await this.usersRepository.findOne({ where: { userId: updateTarefaDto.userId } });
      if (!newUser) {
        throw new NotFoundException(`Novo usuário com ID ${updateTarefaDto.userId} não encontrado.`);
      }
      // Atualiza o objeto user relacionado
      task.user = newUser;
    }

    // Mesclar os dados do DTO com a tarefa existente
    this.tasksRepository.merge(task, updateTarefaDto);

    // Salvar as alterações
    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    // Buscar a tarefa para garantir que ela existe antes de remover
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada para remoção.`);
    }
  }
}
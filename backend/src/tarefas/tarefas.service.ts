// src/tarefas/tarefas.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    const user = await this.usersRepository.findOne({ where: { userId: createTarefaDto.userId } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${createTarefaDto.userId} não encontrado.`);
    }

    const newTask = this.tasksRepository.create({
      ...createTarefaDto,
      user: user,
    });
    return this.tasksRepository.save(newTask);
  }

  async findAllByUserId(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { userId: userId },
      relations: ['user'],
    });
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['user'] });
  }

  async findOne(id: number, ownerId?: number): Promise<Task | null> {
    const whereCondition: any = { taskId: id };
    if (ownerId) {
      whereCondition.userId = ownerId; // Se ownerId for fornecido, filtra por ele
    }

    const task = await this.tasksRepository.findOne({
      where: whereCondition,
      relations: ['user'],
    });

    // Se a tarefa não foi encontrada ou não pertence ao usuário
    if (!task && ownerId) {
        return null;
    }
    if (!task) { // Se não foi encontrado NADA (nem para admin)
        throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
    return task;
  }

  async update(id: number, updateTarefaDto: UpdateTarefaDto, ownerId?: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { taskId: id } });
    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }

    // Se um ownerId foi fornecido (ou seja, não é admin), verificar posse
    if (ownerId && task.userId !== ownerId) {
      throw new ForbiddenException(`Você não tem permissão para atualizar esta tarefa.`);
    }

    // Se um novo userId for fornecido no DTO e for diferente do atual
    if (updateTarefaDto.userId && updateTarefaDto.userId !== task.userId) {
      const newUser = await this.usersRepository.findOne({ where: { userId: updateTarefaDto.userId } });
      if (!newUser) {
        throw new NotFoundException(`Novo usuário com ID ${updateTarefaDto.userId} não encontrado.`);
      }
      task.user = newUser; // Atribui o novo usuário relacionado
    }

    this.tasksRepository.merge(task, updateTarefaDto);
    return this.tasksRepository.save(task);
  }

  // remove agora pode receber um ownerId opcional para verificação de posse
  async remove(id: number, ownerId?: number): Promise<void> {
    const whereCondition: any = { taskId: id };
    if (ownerId) {
      whereCondition.userId = ownerId;
    }

    const result = await this.tasksRepository.delete(whereCondition);
    if (result.affected === 0) {
      // Lança NotFound se não encontrou a tarefa ou se ela não pertencia ao usuário
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada ou você não tem permissão para removê-la.`);
    }
  }
}
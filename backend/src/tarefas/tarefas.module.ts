// src/tarefas/tarefas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TarefasService } from './tarefas.service';
import { TarefasController } from './tarefas.controller';
import { Tarefa as Task } from './entities/tarefa.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
  ],
  controllers: [TarefasController],
  providers: [TarefasService],
})
export class TarefasModule {}
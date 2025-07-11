// src/tarefas/entities/tarefa.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Tarefa {
  @PrimaryGeneratedColumn()
  taskId: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({ default: false })
  concluido: boolean;

  @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' })
  userId: number;
}
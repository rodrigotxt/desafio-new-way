// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserLevel{
    admin = 'admin',
    user = 'user'    
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ 
    type: 'enum',
    enum: UserLevel,
    default: UserLevel.user
    })
  level: UserLevel;
  
  @Column({ nullable: true })
  email: string;
  
}
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({ where: { username } });
    } catch (error) {
      throw new InternalServerErrorException('Falha ao buscar usuário.');
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    try {
      const newUser = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Nome de usuário já existe.');
      }
      throw new InternalServerErrorException('Falha ao criar usuário.');
    }
  }
}
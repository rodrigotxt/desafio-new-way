import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'rodrigo',
      password: 'a1b2c3',
    },
    {
      userId: 2,
      username: 'joao',
      password: 'a1b2c3',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
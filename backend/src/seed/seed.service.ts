// src/seed.service.ts
import { Injectable } from '@nestjs/common';
import { seed } from './seed-user';

@Injectable()
export class SeedService {
  async runSeed() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Não pode rodar em produção');
    }
    await seed();
    return { message: 'Seed executado com sucesso' };
  }
}

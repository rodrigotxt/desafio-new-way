// src/seed.service.ts
import { Injectable } from '@nestjs/common';
import { seed } from './seed-user';

@Injectable()
export class SeedService {
  public async runSeed() {
    await seed();
    return { message: 'Seed executado com sucesso' };
  }
}

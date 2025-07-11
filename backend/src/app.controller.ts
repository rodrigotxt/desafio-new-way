// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SeedService } from './seed/seed.service';
import { InternalServerErrorException } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly seedService: SeedService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('seed')  
  @ApiOperation({ summary: 'Popular o banco com usuários padrão (admin e user).' })
  async runSeed(): Promise<any> {
    const env = process.env.NODE_ENV || 'development';

    if (env === 'production') {
      throw new InternalServerErrorException('Seed não pode ser executado em produção.');
    }

    return this.seedService.runSeed();
  }
}

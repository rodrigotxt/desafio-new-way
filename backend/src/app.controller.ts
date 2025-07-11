import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InternalServerErrorException } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly seedService: SeedService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('seed')  
  async runSeed(): Promise<any> {
    const env = process.env.NODE_ENV || 'development';

    if (env === 'production') {
      throw new InternalServerErrorException('Seed não pode ser executado em produção.');
    }

    return this.seedService.runSeed();
  }
}

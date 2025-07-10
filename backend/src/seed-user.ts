// src/seed-user.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { User } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserLevel } from './users/entities/user.entity';

async function seed() {
  let app: INestApplicationContext | null = null;
  try {
    app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    const configService = app.get(ConfigService); // Pega o ConfigService

    const defaultAdminUsername = configService.get<string>('DEFAULT_ADMIN_USERNAME') || 'admin';
    const defaultAdminPassword = configService.get<string>('DEFAULT_ADMIN_PASSWORD') || 'a1b2c3d4';

    const defaultUsername = configService.get<string>('DEFAULT_ADMIN_USERNAME') || 'user';
    const defaultPassword = configService.get<string>('DEFAULT_ADMIN_PASSWORD') || 'a1b2c3d4';

    console.log(`Verificando se o usuário padrão '${defaultUsername}' existe...`);
    const existingUser = await usersService.findOne(defaultUsername);

    if (!existingUser) {
      console.log(`Usuário '${defaultUsername}' não encontrado. Criando...`);

      const salt = await bcrypt.genSalt(10);
      const hashedAdminPassword = await bcrypt.hash(defaultAdminPassword, salt);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      const newUserAdmin: Partial<User> = {
        username: defaultAdminUsername,
        password: hashedAdminPassword,
        level: UserLevel.admin,
      };
      const newUser: Partial<User> = {
        username: defaultUsername,
        password: hashedPassword,
        level: UserLevel.user,
      };

      await usersService.create(newUserAdmin as any);
      console.log(`Usuário padrão '${defaultAdminUsername}' criado com sucesso!`);
      
      await usersService.create(newUser as any);
      console.log(`Usuário padrão '${defaultUsername}' criado com sucesso!`);
    } else {
      console.log(`Usuário padrão '${defaultUsername}' já existe. Nenhuma ação necessária.`);
    }
  } catch (error) {
    console.error('Erro ao criar usuário padrão:', error);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

seed();
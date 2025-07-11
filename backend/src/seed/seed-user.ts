// src/seed-user.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserLevel } from '../users/entities/user.entity';

export async function seed() {
  let app: INestApplicationContext | null = null;
  try {
    app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    const configService = app.get(ConfigService); // Pega o ConfigService

    const defaultAdminUsername = configService.get<string>('DEFAULT_ADMIN_USERNAME') || 'admin';
    const defaultAdminPassword = configService.get<string>('DEFAULT_ADMIN_PASSWORD') || 'a1b2c3d4';

    const defaultUsername = configService.get<string>('DEFAULT_USERNAME') || 'user';
    const defaultPassword = configService.get<string>('DEFAULT_PASSWORD') || 'a1b2c3d4';

    console.log(`Verificando se o usuário padrão existe...`);
    const existingUser = await usersService.findOne(defaultUsername);
    const existingUserAdmin = await usersService.findOne(defaultAdminUsername);
    console.log(`Usuários encontrados: ${JSON.stringify({ existingUser, existingUserAdmin })}`);

    if (!existingUser && !existingUserAdmin) {
      console.log(`Usuário '${defaultUsername}' não encontrado. Criando...`);

      const newUserAdmin: Partial<User> = {
        username: defaultAdminUsername,
        password: defaultAdminPassword,
        level: UserLevel.admin,
      };
      const newUser: Partial<User> = {
        username: defaultUsername,
        password: defaultPassword,
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
  }
}
if (require.main === module) {
  seed();
}
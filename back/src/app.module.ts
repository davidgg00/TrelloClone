import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { AuthModule } from './auth/auth.module';
import { ListModule } from './list/list.module';
import { TasksModule } from './tasks/tasks.module';
import { BoardPermissionModule } from './board-permission/board-permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // TODO: set to false in production
    }),
    UsersModule,
    BoardsModule,
    AuthModule,
    ListModule,
    TasksModule,
    BoardPermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

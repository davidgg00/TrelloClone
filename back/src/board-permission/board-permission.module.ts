import { Module } from '@nestjs/common';
import { BoardPermissionService } from './board-permission.service';
import { BoardPermissionController } from './board-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardPermission } from './entities/board-permission.entity';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardPermission, Board, User])],
  controllers: [BoardPermissionController],
  providers: [BoardPermissionService],
})
export class BoardPermissionModule {}

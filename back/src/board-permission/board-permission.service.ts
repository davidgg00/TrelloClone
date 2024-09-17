import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardPermissionDto } from './dto/create-board-permission.dto';
import { UpdateBoardPermissionDto } from './dto/update-board-permission.dto';
import { BoardPermission } from './entities/board-permission.entity';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BoardPermissionService {
  constructor(
    @InjectRepository(BoardPermission)
    private boardPermissionRepository: Repository<BoardPermission>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createBoardPermissionDto: CreateBoardPermissionDto,
  ): Promise<BoardPermission> {
    const board = await this.boardRepository.findOne({
      where: { id: createBoardPermissionDto.boardId },
    });
    const user = await this.userRepository.findOne({
      where: { id: createBoardPermissionDto.userId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const boardPermission = this.boardPermissionRepository.create({
      board,
      user,
      permission: createBoardPermissionDto.permission,
    });

    return this.boardPermissionRepository.save(boardPermission);
  }

  async findAll(): Promise<BoardPermission[]> {
    return this.boardPermissionRepository.find({
      relations: ['board', 'user'],
    });
  }

  async findOne(id: number): Promise<BoardPermission> {
    const permission = await this.boardPermissionRepository.findOne({
      where: { id },
      relations: ['board', 'user'],
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async findByBoardId(boardId: number): Promise<BoardPermission[]> {
    return await this.boardPermissionRepository.find({
      where: { board: { id: boardId } },
      relations: ['board', 'user'],
    });
  }

  async update(
    id: number,
    updateDto: UpdateBoardPermissionDto,
  ): Promise<{ message: string }> {
    const result = await this.boardPermissionRepository.update(id, updateDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }

    return { message: `Permission with id ${id} updated` };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.boardPermissionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }

    return { message: `Permission with id ${id} deleted` };
  }
}

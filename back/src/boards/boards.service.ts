import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: User) {
    const { title, is_public } = createBoardDto;
    const newBoard = {
      title,
      is_public,
      created_by: user,
    };

    await this.boardsRepository.save(newBoard);

    return newBoard;
  }

  async findAll(user: User) {
    return await this.boardsRepository.find({
      where: { created_by: { id: user.id } },
    });
  }

  async findOne(id: number) {
    const board = await this.boardsRepository.findOne({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException(`Board with id ${id} not found`);
    }

    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    const { title, is_public } = updateBoardDto;

    const board = await this.boardsRepository.findOne({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException(`Board with id ${id} not found`);
    }

    this.boardsRepository.update(id, {
      title,
      is_public,
    });

    return {
      message: `Board with id ${id} updated`,
    };
  }

  async remove(id: number) {
    const board = await this.boardsRepository.findOne({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException(`Board with id ${id} not found`);
    }

    this.boardsRepository.delete(id);

    return {
      message: `Board with id ${id} deleted`,
    };
  }

  async getListsAndTasks(boardId: number) {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
      relations: ['lists', 'lists.tasks'],
      order: {
        lists: {
          position: 'ASC',
        },
      },
    });

    if (!board) {
      throw new NotFoundException(`Board with id ${boardId} not found`);
    }

    return board;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { Board } from 'src/boards/entities/board.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listsRepository: Repository<List>,
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
  ) {}

  async create(createListDto: CreateListDto): Promise<List> {
    const { title, position, boardId } = createListDto;

    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException(`Board with id ${boardId} not found`);
    }

    const newList = this.listsRepository.create({
      title,
      position,
      board,
    });

    return await this.listsRepository.save(newList);
  }

  async findByBoardId(boardId: number) {
    return await this.listsRepository.find({
      where: { board: { id: boardId } },
    });
  }

  async findOne(id: number) {
    const list = await this.listsRepository.findOne({
      where: { id },
    });

    if (!list) {
      throw new NotFoundException(`List with id ${id} not found`);
    }

    return list;
  }

  async update(id: number, updateListDto: UpdateListDto) {
    const { title, position } = updateListDto;

    const list = await this.listsRepository.findOne({
      where: { id },
    });

    if (!list) {
      throw new NotFoundException(`List with id ${id} not found`);
    }

    await this.listsRepository.update(id, {
      title,
      position,
    });

    return {
      message: `List with id ${id} updated`,
    };
  }

  async remove(id: number) {
    const list = await this.listsRepository.findOne({
      where: { id },
    });

    if (!list) {
      throw new NotFoundException(`List with id ${id} not found`);
    }

    await this.listsRepository.delete(id);

    return {
      message: `List with id ${id} deleted`,
    };
  }
}

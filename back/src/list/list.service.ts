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
    const { title, boardId } = createListDto;

    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException(`Board with id ${boardId} not found`);
    }

    const maxPosition = await this.listsRepository
      .createQueryBuilder('list')
      .where('list.boardId = :boardId', { boardId })
      .select('MAX(list.position)', 'max')
      .getRawOne();

    const newPosition = (maxPosition?.max ?? 0) + 1;

    const newList = this.listsRepository.create({
      title,
      position: newPosition,
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

  async updateListPositions(
    boardId: number,
    movedListId: number,
    targetListId: number,
  ): Promise<void> {
    const lists = await this.listsRepository.find({
      where: { boardId },
      order: { position: 'ASC' },
    });

    let movedListIndex = -1;
    let targetListIndex = -1;

    lists.forEach((list, index) => {
      if (list.id === movedListId) {
        movedListIndex = index;
      }
      if (list.id === targetListId) {
        targetListIndex = index;
      }
    });

    if (movedListIndex === -1 || targetListIndex === -1) {
      throw new Error('List not found');
    }

    const [movedList] = lists.splice(movedListIndex, 1);

    lists.splice(targetListIndex, 0, movedList);

    for (let i = 0; i < lists.length; i++) {
      if (lists[i].position !== i + 1) {
        await this.listsRepository.update(lists[i].id, { position: i + 1 });
      }
    }
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

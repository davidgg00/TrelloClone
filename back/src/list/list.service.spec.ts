import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { Board } from 'src/boards/entities/board.entity';

describe('ListService', () => {
  let service: ListService;

  const mockListRepository = {
    create: jest.fn(),
    findByBoardId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockBoardRepository = {
    findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test Board' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: getRepositoryToken(List),
          useValue: mockListRepository,
        },
        {
          provide: getRepositoryToken(Board),
          useValue: mockBoardRepository,
        },
      ],
    }).compile();

    service = module.get<ListService>(ListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list', async () => {
    const createListDto: CreateListDto = {
      title: 'Test List',
      position: 1,
      boardId: 1,
    };

    const expectedList = {
      title: 'Test List',
      position: 1,
      board: { id: 1, title: 'Test Board' },
    };

    mockListRepository.create.mockReturnValue(expectedList);
    mockListRepository.save.mockResolvedValue(expectedList);

    const result = await service.create(createListDto);

    expect(mockListRepository.create).toHaveBeenCalledWith({
      title: createListDto.title,
      position: createListDto.position,
      board: { id: 1, title: 'Test Board' },
    });

    expect(mockListRepository.save).toHaveBeenCalledWith(expectedList);
    expect(result).toEqual(expectedList);
  });

  it('should find lists by board id', async () => {
    const boardId = 1;

    const expectedLists = [
      { id: 1, title: 'List 1', position: 1, board: { id: boardId } },
      { id: 2, title: 'List 2', position: 2, board: { id: boardId } },
    ];

    mockListRepository.find.mockResolvedValue(expectedLists);

    const result = await service.findByBoardId(boardId);

    expect(mockListRepository.find).toHaveBeenCalledWith({
      where: { board: { id: boardId } },
    });

    expect(result).toEqual(expectedLists);
  });

  it('should find a list by id', async () => {
    const id = 1;

    const expectedList = {
      title: 'Test List',
      board_id: 1,
    };

    mockListRepository.findOne.mockResolvedValue(expectedList);

    const result = await service.findOne(id);

    expect(mockListRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(expectedList);
  });

  it('should update a list', async () => {
    const id = 1;
    const updateListDto: UpdateListDto = {
      title: 'Test List',
      position: 1,
      boardId: 1,
    };

    const expectedList = {
      ...updateListDto,
    };

    mockListRepository.update.mockResolvedValue(expectedList);

    const result = await service.update(id, updateListDto);

    expect(mockListRepository.update).toHaveBeenCalledWith(id, {
      title: updateListDto.title,
      position: updateListDto.position,
    });

    expect(result).toEqual({ message: `List with id ${id} updated` });
  });

  it('should remove a list', async () => {
    const id = 1;

    mockListRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(id);

    expect(mockListRepository.delete).toHaveBeenCalledWith(id);
    expect(result).toEqual({ message: `List with id ${id} deleted` });
  });

  it('should throw an error if try to update a non-existing list', async () => {
    const id = 1;
    const updateListDto: UpdateListDto = {
      title: 'Test List',
      position: 1,
      boardId: 1,
    };

    mockListRepository.update.mockResolvedValue({ affected: 0 });

    try {
      await service.update(id, updateListDto);
    } catch (error) {
      expect(error.message).toEqual(`List with id ${id} not found`);
    }
  });

  it('should throw an error if try to remove a non-existing list', async () => {
    const id = 1;

    mockListRepository.delete.mockResolvedValue({ affected: 0 });

    try {
      await service.remove(id);
    } catch (error) {
      expect(error.message).toEqual(`List with id ${id} not found`);
    }
  });
});

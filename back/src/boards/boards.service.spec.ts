import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/users/entities/user.entity';

describe('BoardsService', () => {
  let service: BoardsService;

  const mockBoardRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        {
          provide: getRepositoryToken(Board),
          useValue: mockBoardRepository,
        },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a board', async () => {
    const createBoardDto: CreateBoardDto = {
      title: 'Test Board',
      is_public: true,
    };

    const user: User = {
      id: 2,
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      boards: [],
    };

    const expectedBoard = {
      ...createBoardDto,
      created_by: user,
    };

    mockBoardRepository.save.mockResolvedValue(expectedBoard);

    const result = await service.create(createBoardDto, user);

    expect(mockBoardRepository.save).toHaveBeenCalledWith(expectedBoard);

    expect(result).toEqual(expectedBoard);
  });

  it('should find all boards', async () => {
    const user: User = {
      id: 2,
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      boards: [],
    };

    const expectedBoards = [
      {
        id: 1,
        title: 'Test Board 1',
        is_public: true,
        created_by: user,
      },
      {
        id: 2,
        title: 'Test Board 2',
        is_public: false,
        created_by: user,
      },
    ];

    mockBoardRepository.find.mockResolvedValue(expectedBoards);

    const result = await service.findAll(user);

    expect(mockBoardRepository.find).toHaveBeenCalledWith({
      where: { created_by: { id: user.id } },
    });

    expect(result).toEqual(expectedBoards);
  });

  it('should find a board by id', async () => {
    const user: User = {
      id: 2,
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      boards: [],
    };

    const boardId = 1;

    const expectedBoard = {
      id: boardId,
      title: 'Test Board',
      is_public: true,
      created_by: user,
    };

    mockBoardRepository.findOne.mockResolvedValue(expectedBoard);

    const result = await service.findOne(boardId);

    expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
      where: { id: boardId },
    });

    expect(result).toEqual(expectedBoard);
  });

  it('should delete a board by id', async () => {
    const user: User = {
      id: 2,
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      boards: [],
    };
    const boardId = 1;

    mockBoardRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(boardId);

    expect(mockBoardRepository.delete).toHaveBeenCalledWith(boardId);

    expect(result).toEqual({ message: `Board with id ${boardId} deleted` });
  });

  it('should update a board by id', async () => {
    const user: User = {
      id: 2,
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      boards: [],
    };

    const boardId = 1;
    const updateBoardDto: CreateBoardDto = {
      title: 'Updated Board',
      is_public: false,
    };

    const existingBoard = {
      id: boardId,
      title: 'Test Board',
      is_public: true,
      created_by: user,
    };

    const expectedBoard = {
      ...existingBoard,
      ...updateBoardDto,
    };

    mockBoardRepository.findOne.mockResolvedValue(existingBoard);
    mockBoardRepository.update.mockResolvedValue(expectedBoard);
    mockBoardRepository.findOne.mockResolvedValue(expectedBoard);

    const result = await service.update(boardId, updateBoardDto);

    expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
      where: { id: boardId },
    });

    expect(mockBoardRepository.update).toHaveBeenCalledWith(
      boardId,
      updateBoardDto,
    );

    expect(result).toEqual({ message: `Board with id ${boardId} updated` });
  });

  it('should throw an error when updating a non-existing board', async () => {
    const boardId = 1;
    const updateBoardDto: CreateBoardDto = {
      title: 'Updated Board',
      is_public: false,
    };

    mockBoardRepository.findOne.mockResolvedValue(null);

    await expect(service.update(boardId, updateBoardDto)).rejects.toThrowError(
      'Board with id 1 not found',
    );
  });

  it('should throw an error when deleting a non-existing board', async () => {
    const boardId = 1;

    mockBoardRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove(boardId)).rejects.toThrowError(
      'Board with id 1 not found',
    );
  });

  it('should throw an error when finding a non-existing board', async () => {
    const boardId = 1;

    mockBoardRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(boardId)).rejects.toThrowError(
      'Board with id 1 not found',
    );
  });
});

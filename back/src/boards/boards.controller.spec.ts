import { Test, TestingModule } from '@nestjs/testing';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/users/entities/user.entity';

describe('BoardsController', () => {
  let controller: BoardsController;
  let service: BoardsService;

  const mockBoardsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockBoardRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        {
          provide: BoardsService,
          useValue: mockBoardsService,
        },
        {
          provide: getRepositoryToken(Board),
          useValue: mockBoardRepository,
        },
        {
          provide: APP_GUARD,
          useValue: mockJwtAuthGuard,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<BoardsController>(BoardsController);
    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create when create is called', async () => {
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

    const createdBoard = {
      id: 1,
      ...createBoardDto,
      created_by: user,
    };

    mockBoardsService.create.mockResolvedValue(createdBoard);

    const result = await controller.create(createBoardDto, { user });

    expect(mockBoardsService.create).toHaveBeenCalledWith(createBoardDto, user);

    expect(result).toEqual(createdBoard);
  });

  it('should call service.findAll when findAll is called', async () => {
    const user = { id: 2 };
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

    mockBoardsService.findAll.mockResolvedValue(expectedBoards);

    const mockRequest = { user };

    const result = await controller.findAll(mockRequest);

    expect(mockBoardsService.findAll).toHaveBeenCalledWith(user.id);

    expect(result).toEqual(expectedBoards);
  });

  it('should call service.findOne when findOne is called', async () => {
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

    mockBoardsService.findOne.mockResolvedValue(expectedBoard);

    const result = await controller.findOne(boardId.toString());

    expect(mockBoardsService.findOne).toHaveBeenCalledWith(boardId);

    expect(result).toEqual(expectedBoard);
  });

  it('should call service.update when update is called', async () => {
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

    const expectedUpdateResult = {
      message: `Board with id ${boardId} updated`,
    };

    mockBoardsService.findOne.mockResolvedValue(existingBoard);

    mockBoardsService.update.mockResolvedValue(expectedUpdateResult);

    const result = await controller.update(boardId.toString(), updateBoardDto);

    expect(mockBoardsService.findOne).toHaveBeenCalledWith(boardId);

    expect(mockBoardsService.update).toHaveBeenCalledWith(
      boardId,
      updateBoardDto,
    );

    expect(result).toEqual(expectedUpdateResult);
  });

  it('should call service.remove when remove is called', async () => {
    const user: User = {
      id: 2,
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      boards: [],
    };

    const boardId = 1;

    const expectedRemoveResult = {
      message: `Board with id ${boardId} deleted`,
    };

    mockBoardsService.findOne.mockResolvedValue({
      id: boardId,
      title: 'Test Board',
      is_public: true,
      created_by: user,
    });

    mockBoardsService.remove.mockResolvedValue(expectedRemoveResult);

    const result = await controller.remove(boardId.toString());

    expect(mockBoardsService.findOne).toHaveBeenCalledWith(boardId);

    expect(mockBoardsService.remove).toHaveBeenCalledWith(boardId);

    expect(result).toEqual(expectedRemoveResult);
  });
});

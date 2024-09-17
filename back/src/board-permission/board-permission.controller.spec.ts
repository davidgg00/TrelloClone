import { Test, TestingModule } from '@nestjs/testing';
import { BoardPermissionController } from './board-permission.controller';
import { BoardPermissionService } from './board-permission.service';
import { CreateBoardPermissionDto } from './dto/create-board-permission.dto';
import { UpdateBoardPermissionDto } from './dto/update-board-permission.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { BoardPermission } from './entities/board-permission.entity';

describe('BoardPermissionController', () => {
  let controller: BoardPermissionController;
  let service: BoardPermissionService;

  const mockBoardPermissionService = {
    create: jest.fn(),
    findByBoardId: jest.fn(),
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

  const mockBoardPermissionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardPermissionController],
      providers: [
        {
          provide: BoardPermissionService,
          useValue: mockBoardPermissionService,
        },
        {
          provide: getRepositoryToken(BoardPermission),
          useValue: mockBoardPermissionRepository,
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

    controller = module.get<BoardPermissionController>(
      BoardPermissionController,
    );
    service = module.get<BoardPermissionService>(BoardPermissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create when create is called', async () => {
    const createDto: CreateBoardPermissionDto = {
      boardId: 1,
      userId: 1,
      permission: 'write',
    };

    await controller.create(createDto);

    expect(service.create).toHaveBeenCalledWith(createDto);
    expect(controller.create).toBeDefined();
  });

  it('should call service.findByBoardId when findByBoardId is called', async () => {
    await controller.findByBoardId('1');

    expect(service.findByBoardId).toHaveBeenCalledWith(1);
    expect(controller.findByBoardId).toBeDefined();
  });

  it('should call service.findOne when findOne is called', async () => {
    await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(controller.findOne).toBeDefined();
  });

  it('should call service.update when update is called', async () => {
    const updateDto: UpdateBoardPermissionDto = {
      permission: 'read',
    };

    await controller.update('1', updateDto);

    expect(service.update).toHaveBeenCalledWith(1, updateDto);
    expect(controller.update).toBeDefined();
  });

  it('should call service.remove when remove is called', async () => {
    await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(controller.remove).toBeDefined();
  });
});

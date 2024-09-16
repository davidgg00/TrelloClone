import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { List } from './entities/list.entity';
import { CreateListDto } from './dto/create-list.dto';

describe('ListController', () => {
  let controller: ListController;
  let service: ListService;

  const mockBoardsService = {
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

  const mockListRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [
        {
          provide: ListService,
          useValue: mockBoardsService,
        },
        {
          provide: getRepositoryToken(List),
          useValue: mockListRepository,
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

    controller = module.get<ListController>(ListController);
    service = module.get<ListService>(ListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create when create is called', async () => {
    const createListDto: CreateListDto = {
      title: 'title',
      position: 1,
      boardId: 1,
    };

    await controller.create(createListDto);

    expect(service.create).toHaveBeenCalledWith(createListDto);
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
    const updateListDto: CreateListDto = {
      title: 'title',
      position: 1,
      boardId: 1,
    };

    await controller.update('1', updateListDto);

    expect(service.update).toHaveBeenCalledWith(1, updateListDto);
    expect(controller.update).toBeDefined();
  });

  it('should call service.remove when remove is called', async () => {
    await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(controller.remove).toBeDefined();
  });
});

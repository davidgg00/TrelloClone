import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAllByListId: jest.fn(),
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

  const mockTaskRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
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

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call service.create when create is called', async () => {
    const createTaskDto = {
      title: 'Test task',
      description: 'Test description',
      position: 0,
      listId: 1,
      assignedUserId: 1,
    };

    await controller.create(createTaskDto);

    expect(service.create).toHaveBeenCalledWith(createTaskDto);
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(controller.create).toBeDefined();
  });

  it('should call service.findAllByListId when findAll is called', async () => {
    await controller.findAll('1');

    expect(service.findAllByListId).toHaveBeenCalledWith(1);
    expect(service.findAllByListId).toHaveBeenCalledTimes(1);
    expect(controller.findAll).toBeDefined();
  });

  it('should call service.findOne when findOne is called', async () => {
    await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(controller.findOne).toBeDefined();
  });

  it('should call service.update when update is called', async () => {
    const updateTaskDto: CreateTaskDto = {
      title: 'Updated task',
      description: 'Updated description',
      position: 1,
      listId: 1,
      assignedUserId: 1,
    };

    await controller.update('1', updateTaskDto);

    expect(service.update).toHaveBeenCalledWith(1, updateTaskDto);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(controller.update).toBeDefined();
  });

  it('should call service.remove when remove is called', async () => {
    await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(service.remove).toHaveBeenCalledTimes(1);
    expect(controller.remove).toBeDefined();
  });
});

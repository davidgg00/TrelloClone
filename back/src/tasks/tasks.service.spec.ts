import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/users/entities/user.entity';

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const mockListRepository = {
    findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test List' }),
  };

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(List),
          useValue: mockListRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      position: 1,
      listId: 1,
      assignedUserId: 1,
    };

    const expectedTask = {
      title: 'Test Task',
      description: 'Test Description',
      position: 1,
      list: { id: 1, title: 'Test List' },
      assignedUser: { id: 1, name: 'Test User' },
    };

    mockTaskRepository.create.mockReturnValue(expectedTask);
    mockTaskRepository.save.mockResolvedValue(expectedTask);

    const result = await service.create(createTaskDto);

    expect(mockTaskRepository.create).toHaveBeenCalledWith({
      title: createTaskDto.title,
      description: createTaskDto.description,
      position: createTaskDto.position,
      list: { id: 1, title: 'Test List' },
      assignedUser: { id: 1, name: 'Test User' },
    });

    expect(mockTaskRepository.save).toHaveBeenCalledWith(expectedTask);
    expect(result).toEqual(expectedTask);
  });

  it('should find tasks by list id', async () => {
    const listId = 1;

    const expectedTasks = [
      {
        id: 1,
        title: 'Task 1',
        position: 1,
        list: { id: listId },
        assignedUserId: 1,
      },
      {
        id: 2,
        title: 'Task 2',
        position: 2,
        list: { id: listId },
        assignedUserId: 2,
      },
    ];

    mockTaskRepository.find.mockResolvedValue(expectedTasks);

    const result = await service.findAllByListId(listId);

    expect(mockTaskRepository.find).toHaveBeenCalledWith({
      where: { list: { id: listId } },
    });

    expect(result).toEqual(expectedTasks);
  });

  it('should find a task by id', async () => {
    const id = 1;

    const expectedTask = {
      title: 'Test Task',
      description: 'Test Description',
      position: 0,
      list: { id: 1, title: 'Test List' },
      assignedUserId: 1,
    };

    mockTaskRepository.findOne.mockResolvedValue(expectedTask);

    const result = await service.findOne(id);

    expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(expectedTask);
  });

  it('should update a task', async () => {
    const id = 1;
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      position: 1,
      listId: 1,
      assignedUserId: 1,
    };

    const expectedTask = {
      title: 'Updated Task',
      description: 'Updated Description',
      position: 1,
      list: { id: 1, title: 'Test List' },
      assignedUser: { id: 1, name: 'Test User' },
    };

    mockTaskRepository.update.mockResolvedValue(expectedTask);

    const result = await service.update(id, updateTaskDto);

    expect(mockTaskRepository.update).toHaveBeenCalledWith(id, {
      title: updateTaskDto.title,
      description: updateTaskDto.description,
      position: updateTaskDto.position,
      list: { id: 1, title: 'Test List' },
      assignedUser: { id: 1, name: 'Test User' },
    });

    expect(result).toEqual({ message: `Task with id ${id} updated` });
  });

  it('should remove a task', async () => {
    const id = 1;

    mockTaskRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(id);

    expect(mockTaskRepository.delete).toHaveBeenCalledWith({ id: id });
    expect(result).toEqual({ message: `Task with id ${id} deleted` });
  });

  it('should throw an error if try to update a non-existing task', async () => {
    const id = 1;
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      position: 1,
      listId: 1,
      assignedUserId: 1,
    };

    mockTaskRepository.update.mockResolvedValue({ affected: 0 });

    try {
      await service.update(id, updateTaskDto);
    } catch (error) {
      expect(error.message).toEqual(`Task with id ${id} not found`);
    }
  });

  it('should throw an error if try to remove a non-existing task', async () => {
    const id = 1;

    mockTaskRepository.delete.mockResolvedValue({ affected: 0 });

    try {
      await service.remove(id);
    } catch (error) {
      expect(error.message).toEqual(`Task with id ${id} not found`);
    }
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BoardPermissionService } from './board-permission.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BoardPermission } from './entities/board-permission.entity';
import { Board } from '../boards/entities/board.entity';
import { User } from '../users/entities/user.entity';
import { CreateBoardPermissionDto } from './dto/create-board-permission.dto';
import { UpdateBoardPermissionDto } from './dto/update-board-permission.dto';

describe('BoardPermissionService', () => {
  let service: BoardPermissionService;

  const mockBoardPermissionRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };

  const mockBoardRepository = {
    findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test Board' }),
  };

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardPermissionService,
        {
          provide: getRepositoryToken(BoardPermission),
          useValue: mockBoardPermissionRepository,
        },
        {
          provide: getRepositoryToken(Board),
          useValue: mockBoardRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<BoardPermissionService>(BoardPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a board permission', async () => {
    const createDto: CreateBoardPermissionDto = {
      boardId: 1,
      userId: 1,
      permission: 'write',
    };

    const expectedPermission = {
      board: { id: 1, title: 'Test Board' },
      user: { id: 1, name: 'Test User' },
      permission: 'write',
    };

    mockBoardPermissionRepository.create.mockReturnValue(expectedPermission);
    mockBoardPermissionRepository.save.mockResolvedValue(expectedPermission);

    const result = await service.create(createDto);

    expect(mockBoardPermissionRepository.create).toHaveBeenCalledWith({
      board: { id: 1, title: 'Test Board' },
      user: { id: 1, name: 'Test User' },
      permission: createDto.permission,
    });
    expect(mockBoardPermissionRepository.save).toHaveBeenCalledWith(
      expectedPermission,
    );
    expect(result).toEqual(expectedPermission);
  });

  it('should find permissions by board id', async () => {
    const boardId = 1;

    const expectedPermissions = [
      { id: 1, board: { id: boardId }, user: { id: 1 }, permission: 'read' },
      { id: 2, board: { id: boardId }, user: { id: 2 }, permission: 'write' },
    ];

    mockBoardPermissionRepository.find.mockResolvedValue(expectedPermissions);

    const result = await service.findByBoardId(boardId);

    expect(mockBoardPermissionRepository.find).toHaveBeenCalledWith({
      where: { board: { id: boardId } },
      relations: ['board', 'user'],
    });

    expect(result).toEqual(expectedPermissions);
  });

  it('should find a permission by id', async () => {
    const id = 1;

    const expectedPermission = {
      id: 1,
      board: { id: 1 },
      user: { id: 1 },
      permission: 'write',
    };

    mockBoardPermissionRepository.findOne.mockResolvedValue(expectedPermission);

    const result = await service.findOne(id);

    expect(mockBoardPermissionRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ['board', 'user'], // Añadir relaciones para hacer match
    });
    expect(result).toEqual(expectedPermission);
  });

  it('should update a board permission', async () => {
    const id = 1;

    // Asegúrate de que el valor de permission es uno de los valores permitidos.
    const updateDto: UpdateBoardPermissionDto = {
      permission: 'read', // 'read' o 'write'
    };

    mockBoardPermissionRepository.update.mockResolvedValue({ affected: 1 });

    const result = await service.update(id, updateDto);

    expect(mockBoardPermissionRepository.update).toHaveBeenCalledWith(id, {
      permission: updateDto.permission,
    });

    expect(result).toEqual({ message: `Permission with id ${id} updated` });
  });

  it('should update a board permission', async () => {
    const id = 1;
    const updateDto: UpdateBoardPermissionDto = { permission: 'read' };

    const expectedPermission = {
      board: { id: 1, title: 'Test Board' },
      user: { id: 1, name: 'Test User' },
      permission: 'read',
    };

    mockBoardPermissionRepository.update.mockResolvedValue({ affected: 1 });
    mockBoardPermissionRepository.findOne.mockResolvedValue(expectedPermission);

    const result = await service.update(id, updateDto);

    expect(mockBoardPermissionRepository.update).toHaveBeenCalledWith(
      id,
      updateDto,
    );
    expect(result).toEqual({ message: `Permission with id ${id} updated` });
  });

  it('should remove a board permission', async () => {
    const id = 1;

    mockBoardPermissionRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(id);

    expect(mockBoardPermissionRepository.delete).toHaveBeenCalledWith(id);
    expect(result).toEqual({ message: `Permission with id ${id} deleted` });
  });

  it('should throw an error if trying to update a non-existing permission', async () => {
    const id = 1;
    const updateDto: UpdateBoardPermissionDto = { permission: 'read' };

    mockBoardPermissionRepository.update.mockResolvedValue({ affected: 0 });

    await expect(service.update(id, updateDto)).rejects.toThrow(
      `Permission with id ${id} not found`,
    );
  });
});

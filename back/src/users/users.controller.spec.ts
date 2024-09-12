import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    register: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
    login: jest.fn().mockResolvedValue({ token: 'test-token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.register when create is called', async () => {
    const dto: CreateUserDto = {
      email: 'test@test.com',
      password: '1234',
      name: 'Test',
    };
    await controller.create(dto);
    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('should call service.login when login is called', async () => {
    const loginDto = { email: 'test@test.com', password: '1234' };
    await controller.login(loginDto);
    expect(service.login).toHaveBeenCalledWith(loginDto);
  });
});

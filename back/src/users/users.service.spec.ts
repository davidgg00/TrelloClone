import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: Partial<Repository<User>>;
  let mockJwtService: JwtService;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn().mockImplementation((user) => user),
      save: jest.fn().mockResolvedValue({
        id: 1,
        email: 'testuser@testuser.com',
        name: 'Test User',
      }),
      findOne: jest.fn().mockImplementation(({ where: { email } }) => {
        if (email === 'testuser@testuser.com') {
          return Promise.resolve({
            id: 1,
            email: 'testuser@testuser.com',
            name: 'Test User',
            password: 'password1234',
          });
        }
        return null;
      }),
    };

    mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked-token'),
    } as unknown as JwtService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should register a user', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');

    const user = await service.register({
      email: 'newuser@testuser.com',
      name: 'New User',
      password: 'password',
    });

    expect(user.email).toBe('newuser@testuser.com');
    expect(user.name).toBe('New User');
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('should fail to register a user with an existing email', async () => {
    await expect(
      service.register({
        email: 'testuser@testuser.com',
        name: 'Test User',
        password: 'password',
      }),
    ).rejects.toThrow('User already exists');
  });

  it('should authenticate a user', async () => {
    // Mock bcrypt.compare to return true if the password is correct
    (bcrypt.compare as jest.Mock).mockImplementation(
      (password, hashedPassword) => {
        if (password === 'password1234' && hashedPassword === 'password1234') {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      },
    );

    const loginResult = await service.login({
      email: 'testuser@testuser.com',
      password: 'password1234',
    });

    expect(loginResult).toHaveProperty('token');
    expect(mockJwtService.signAsync).toHaveBeenCalledWith({
      email: 'testuser@testuser.com',
      id: 1,
    });
  });

  it('should fail to authenticate a user with invalid credentials', async () => {
    // Mock bcrypt.compare to return false if the password is incorrect
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({
        email: 'testuser@testuser.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

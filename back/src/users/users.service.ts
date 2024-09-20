import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const userExists = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const newUser: User = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(newUser);

    return newUser;
  }

  async login({ email, password }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, id: user.id };

    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async checkToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      return { validToken: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(List)
    private listsRepository: Repository<List>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const { title, description, position, listId, assignedUserId } =
      createTaskDto;

    const list = await this.listsRepository.findOne({ where: { id: listId } });
    if (!list) {
      throw new NotFoundException(`List with id ${listId} not found`);
    }

    const assignedUser = await this.usersRepository.findOne({
      where: { id: assignedUserId },
    });

    if (!assignedUser) {
      throw new NotFoundException(`User with id ${assignedUserId} not found`);
    }

    const newTask = this.tasksRepository.create({
      title,
      description,
      position,
      list,
      assignedUser,
    });

    await this.tasksRepository.save(newTask);

    return newTask;
  }

  async findAllByListId(listId: number): Promise<Task[]> {
    return await this.tasksRepository.find({ where: { list: { id: listId } } });
  }

  async findOne(id: number) {
    return await this.tasksRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { title, description, position, listId, assignedUserId } =
      updateTaskDto;

    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    const list = await this.listsRepository.findOne({ where: { id: listId } });
    if (!list) {
      throw new NotFoundException(`List with id ${listId} not found`);
    }

    const assignedUser = await this.usersRepository.findOne({
      where: { id: assignedUserId },
    });

    if (!assignedUser) {
      throw new NotFoundException(`User with id ${assignedUserId} not found`);
    }

    this.tasksRepository.update(id, {
      title,
      description,
      position,
      list,
      assignedUser,
    });

    return {
      message: `Task with id ${id} updated`,
    };
  }

  async remove(id: number) {
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    this.tasksRepository.delete({ id });

    return {
      message: `Task with id ${id} deleted`,
    };
  }
}

import { Board } from 'src/boards/entities/board.entity';
import { Task } from 'src/tasks/entities/task.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  position: number;

  @Column()
  boardId: number;

  @ManyToOne(() => Board, (board) => board.lists)
  board: Board;

  @OneToMany(() => Task, (task) => task.list)
  tasks: Task[];
}

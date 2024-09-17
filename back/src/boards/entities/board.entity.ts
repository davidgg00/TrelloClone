import { BoardPermission } from 'src/board-permission/entities/board-permission.entity';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'boolean', nullable: false })
  is_public: boolean;

  @ManyToOne(() => User, (user) => user.boards, { nullable: false })
  created_by: User;

  @OneToMany(() => List, (list) => list.board)
  lists: List[];

  @OneToMany(() => BoardPermission, (permission) => permission.board)
  permissions: BoardPermission[];
}

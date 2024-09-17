import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('board_permissions')
export class BoardPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board, (board) => board.permissions, { onDelete: 'CASCADE' })
  board: Board;

  @ManyToOne(() => User, (user) => user.permissions, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  permission: string; // Can be 'read' or 'write'
}

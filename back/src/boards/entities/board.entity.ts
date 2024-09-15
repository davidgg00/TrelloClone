import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}

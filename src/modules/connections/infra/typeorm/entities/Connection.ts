import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('connections')
class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;
  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'})
  user1: User

  @Column()
  connected_user_id: string;
  @ManyToOne(() => User)
  @JoinColumn({name: 'connected_user_id'})
  user2: User
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Connection;

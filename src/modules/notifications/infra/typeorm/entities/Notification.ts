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

@Entity('notifications')
class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  recipient_id: string;
  @ManyToOne(() => User)
  @JoinColumn({name: 'recipient_id'})
  user: User

  @Column()
  title: string;

  @Column('boolean')
  read: boolean;

  @Column()
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Notification;

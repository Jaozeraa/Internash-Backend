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
import Project from '@modules/projects/infra/typeorm/entities/Project';

@Entity('employees')
class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  payment: number;

  @Column()
  status: string;

  @Column()
  user_id: string;
  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'})
  user: User

  @Column()
  project_id: string;
  @ManyToOne(() => User)
  @JoinColumn({name: 'project_id'})
  project: Project
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Employee;

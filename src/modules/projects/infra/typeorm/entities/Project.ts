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
import { Expose } from 'class-transformer';
import uploadConfig from '@config/upload'

@Entity('projects')
class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  owner_id: string;
  @ManyToOne(() => User)
  @JoinColumn({name: 'owner_id'})
  user: User

  @Column()
  image: string

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'image_url' })
  getImage_url(): string | null {
      if(!this.image) {
          return null
      }

      switch(uploadConfig.driver) {
          case 'disk': 
              return `${process.env.APP_API_URL}/files/${this.image}`
          default: 
              return null
      }
  }
}

export default Project;

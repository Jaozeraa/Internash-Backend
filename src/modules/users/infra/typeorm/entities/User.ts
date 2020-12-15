import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer'

import uploadConfig from '@config/upload'

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  cpf: string;

  @Column()
  skill: string;

  @Column()
  avatar: string

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatar_url(): string | null {
      if(!this.avatar) {
          return null
      }

      switch(uploadConfig.driver) {
          case 'disk': 
              return `${process.env.APP_API_URL}/files/${this.avatar}`
          default: 
              return null
      }
  }
}

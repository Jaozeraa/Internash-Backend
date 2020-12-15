import "reflect-metadata"
import { injectable, inject } from 'tsyringe'

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError'

interface IRequest {
    name: string;
    email: string;
    password: string;
    skill: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
    public async execute({ name, email, password, skill }: IRequest): Promise<User> {
      const userExists = await this.usersRepository.findByEmail(email);

      if (userExists) {
          throw new AppError('This email is already taken.')
      }

      const hashedPassword = await this.hashProvider.generateHash(password)

      
      const user = await this.usersRepository.create({
        name, 
        email, 
        password: hashedPassword,
        skill
      });

      return user;
    }
}
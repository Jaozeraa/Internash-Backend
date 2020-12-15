import { sign } from 'jsonwebtoken';
import "reflect-metadata"
import { injectable, inject } from 'tsyringe'

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import authConfig from '@config/auth';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError'

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}
    public async execute({  email, password }: IRequest): Promise<IResponse> {
      const user = await this.usersRepository.findByEmail(email);

      if (!user) {
          throw new AppError('Email/password combination invalid.')
      }
      
      const passwordMatches = await this.hashProvider.compareHash(password, user.password);
      
      if (!passwordMatches) {
        throw new AppError('Email/password combination invalid.');
      }

      const { expiresIn, secret } = authConfig.jwt;
      
      const token = sign({}, secret, {
        expiresIn,
        subject: user.id,
      });
      
      return {
        user,
        token,
      };
    }
}
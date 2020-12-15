import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import ICreateConnectionDTO from '@modules/connections/dtos/ICreateConnectionDTO';
import IConnectionsRepository from '@modules/connections/repositories/IConnectionsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest{
  connected_user_email: string
  user_id: string
}

@injectable()
export default class CreateConnectionService {
  constructor(
    @inject('ConnectionsRepository')
    private connectionsRepository: IConnectionsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, connected_user_email }: IRequest) {
      const userExists = await this.usersRepository.findByEmail(connected_user_email);

      if (!userExists) {
        throw new AppError('This user id is invalid');
      }

      if (user_id === userExists.id) {
        throw new AppError('You can`t add yourself');
      }
    
      const connection = await this.connectionsRepository.create({
        user_id,
        connected_user_id: userExists.id,
      });

      return connection;
  }
}
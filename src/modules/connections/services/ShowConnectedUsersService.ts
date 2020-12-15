import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import IConnectionsRepository from '@modules/connections/repositories/IConnectionsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ShowConnectedUsersService {
  constructor(
    @inject('ConnectionsRepository')
    private connectionsRepository: IConnectionsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest) {
      const userExists = await this.usersRepository.findById(user_id);

      if (!userExists) {
        throw new AppError('This user id is invalid');
      }
    
      const connections = await this.connectionsRepository.findAllByUserId(user_id);

      const formattedConnectionsPromise = connections.map(async (connection) => {
        const user = await this.usersRepository.findById(connection.connected_user_id)

        return {
          ...connection,
          user
        }
      })

      const formattedConnections = await Promise.all(formattedConnectionsPromise);

      return formattedConnections;
  }
}
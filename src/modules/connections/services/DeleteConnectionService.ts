import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import IConnectionsRepository from '@modules/connections/repositories/IConnectionsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

@injectable()
export default class DeleteConnectionService {
  constructor(
    @inject('ConnectionsRepository')
    private connectionsRepository: IConnectionsRepository,
  ) {}

  public async execute({ id }: IRequest) {
      const connection = await this.connectionsRepository.findById(id);

      if (!connection) {
        throw new AppError('This connection id is invalid');
      }

      await this.connectionsRepository.deleteByConnection(connection)

      return;
  }
}
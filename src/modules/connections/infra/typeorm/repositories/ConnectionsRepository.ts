import { getRepository, Repository } from 'typeorm';

import ICreateConnectionDTO from '@modules/connections/dtos/ICreateConnectionDTO';
import IConnectionsRepository from '@modules/connections/repositories/IConnectionsRepository';
import Connection from '@modules/connections/infra/typeorm/entities/Connection';

class ConnectionsRepository implements IConnectionsRepository {
  private ormRepository: Repository<Connection>
  constructor() {
    this.ormRepository = getRepository(Connection)
  }
  public async create({connected_user_id, user_id}: ICreateConnectionDTO): Promise<Connection> {
    const connection = this.ormRepository.create({
      connected_user_id, 
      user_id
    });

    await this.ormRepository.save(connection);

    return connection;
  }

  public async findById(id: string): Promise<Connection | undefined> {
    const connection = await this.ormRepository.findOne(id);

    return connection;
  }

  public async findAllByUserId(user_id: string): Promise<Connection[]> {
    const connections = await this.ormRepository.find({
      where: { user_id }
    });

    return connections;
  }

  public async deleteByConnection(connection: Connection): Promise<void> {
    await this.ormRepository.remove(connection)

    return
}
}

export default ConnectionsRepository;

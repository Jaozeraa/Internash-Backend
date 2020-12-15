import IConnectionsRepository from '@modules/connections/repositories/IConnectionsRepository';
import ICreateConnectionDTO from '@modules/connections/dtos/ICreateConnectionDTO';
import Connection from '@modules/connections/infra/typeorm/entities/Connection';
import { uuid } from 'uuidv4';

export default class FakeConnectionsRepository implements IConnectionsRepository {
  private connections: Connection[] = [];
  public async create({ user_id, connected_user_id }: ICreateConnectionDTO) {
    const connection = new Connection();

    Object.assign(connection, {
      id: uuid(),
      connected_user_id,
      user_id,
      updated_at: new Date(),
      created_at: new Date(),
  })

    this.connections.push(connection);

    return connection;
  }

  public async findById(id: string): Promise<Connection | undefined> {
    const connection = this.connections.find(findConnection => findConnection.id === id);
    
    return connection;
  }

  public async deleteByConnection(connection: Connection): Promise<void> {
    const connectionIndex = this.connections.findIndex(filteredConnection => filteredConnection === connection)

      delete this.connections[connectionIndex]

      return
  }

  public async findAllByUserId(user_id: string): Promise<Connection[]> {
    const connections = this.connections.filter(filteredConnection => filteredConnection.user_id === user_id);
    
    return connections;
  }
}
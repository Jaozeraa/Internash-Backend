import ICreateConnectionDTO from '../dtos/ICreateConnectionDTO';
import Connection from '../infra/typeorm/entities/Connection';

export default interface IEmployeesRepository {
  create(data: ICreateConnectionDTO): Promise<Connection>;
  findById(id: string): Promise<Connection | undefined>;
  findAllByUserId(user_id: string): Promise<Connection[]>;
  deleteByConnection(connection: Connection): Promise<void>;
}
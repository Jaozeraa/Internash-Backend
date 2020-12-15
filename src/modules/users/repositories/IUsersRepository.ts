import CreateUserDTO from '../dtos/CreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  create(data: CreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  deleteByUser(user:User): Promise<void>;
}

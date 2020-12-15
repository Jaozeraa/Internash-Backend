import { v4 as uuid } from 'uuid';
import IUsersRepository from '../IUsersRepository';
import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];
  public async create({ name, email, password, skill }: CreateUserDTO): Promise<User> {
      const user = new User();

      Object.assign(user, {
        id: uuid(),
        name,
        email,
        password,
        skill,
        updated_at: new Date(),
        created_at: new Date(),
    })

    this.users.unshift(user)

    return user;
    }

    public async findByEmail(email: string): Promise<User | undefined>{
      const user = this.users.find(findUser => findUser.email === email);

      return user;
    }

    public async findById(id: string): Promise<User | undefined>{
      const user = this.users.find(user => user.id === id)
      return user;
    }

    public async findAll(): Promise<User[]>{
      return this.users;
    }

    public async deleteByUser(user: User): Promise<void> {
      const userIndex = this.users.findIndex(filteredUser => filteredUser === user)

      delete this.users[userIndex]

      return
    }

    public async save(user: User): Promise<User> {
      const userIndex = this.users.findIndex(findUser => findUser === user);

      this.users[userIndex] = user;

      return user;
    }
}

export default FakeUsersRepository
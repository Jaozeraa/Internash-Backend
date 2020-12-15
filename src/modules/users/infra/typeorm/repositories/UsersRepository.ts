import { Repository, getRepository } from 'typeorm'

import IUsersRepository from '../../../repositories/IUsersRepository'
import CreateUserDto from '../../../dtos/CreateUserDTO'
import User from '../entities/User'

class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>
    constructor() {
        this.ormRepository = getRepository(User)
    }
    public async create({ name, email, password, skill }: CreateUserDto): Promise<User> {
        const user = await this.ormRepository.create({
            name,
            email,
            password,
            skill
        })

        await this.ormRepository.save(user)

        return user
    }

    public async findByEmail( email: string ): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({ where: { email } });

        return user;
    }

    public async findById( id: string ): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({ where: { id } });

        return user;
    }

    public async findAll(): Promise<User[]> {
        const users = await this.ormRepository.find()

        return users
    }

    public async deleteByUser( user: User ): Promise<void> {
        await this.ormRepository.remove(user)

        return
    }
    
    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UsersRepository
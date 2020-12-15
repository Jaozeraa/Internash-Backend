import "reflect-metadata"
import { injectable, inject } from 'tsyringe'

import IUsersRepository from '../repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import User from '../infra/typeorm/entities/User'

interface IRequest {
    user_id: string
}

@injectable()
class ShowUsersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ user_id }: IRequest): Promise<User[]> {
        const yourUser = await this.usersRepository.findById(user_id)

        if (!yourUser) {
            throw new AppError('User not founded.')
        }

        const allUsers = await this.usersRepository.findAll()

        const anotherUsers = allUsers.filter(user => user.id !== yourUser.id)
        
        return anotherUsers
    }
}

export default ShowUsersService
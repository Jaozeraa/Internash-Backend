import "reflect-metadata"
import { injectable, inject } from 'tsyringe'

import IUsersRepository from '../repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import User from '../infra/typeorm/entities/User'

interface IRequest {
    user_id: string
    email: string
}

@injectable()
class FindUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ user_id, email }: IRequest): Promise<User | undefined> {
        const yourUser = await this.usersRepository.findById(user_id)

        if (!yourUser) {
            throw new AppError('User not founded.')
        }

        const user = await this.usersRepository.findByEmail(email)
        if(user === yourUser) {
            throw new AppError('You can`t find yourself.')
        }
        
        return user
    }
}

export default FindUserService
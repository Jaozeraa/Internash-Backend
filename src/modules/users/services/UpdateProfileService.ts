import "reflect-metadata"
import { injectable, inject } from 'tsyringe'

import IUsersRepository from '../repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import User from '../infra/typeorm/entities/User'

import { isValidCPF, isValidCNPJ, formatCNPJ, formatCPF } from '@brazilian-utils/brazilian-utils';

interface IRequest {
    user_id: string
    name: string
    email: string
    cpf?: string
    skill: string
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ user_id, name, email, cpf, skill }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id)

        if (!user) {
            throw new AppError('User not founded.')
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email)

        if(userWithUpdatedEmail && userWithUpdatedEmail.id!== user.id) {
            throw new AppError('E-mail already in use.')
        }

        user.email = email
        user.name = name
        user.skill = skill

        if(cpf) {
            const validCpf = isValidCPF(cpf)
            const validCnpj = isValidCNPJ(cpf)

            if (!validCpf) {
                if (!validCnpj) {
                    throw new AppError('CPF/CNPJ invalid.')
                }

                const formattedCnpj = formatCNPJ(cpf)

                user.cpf = formattedCnpj

                return this.usersRepository.save(user)
            }

            const formattedCpf = formatCPF(cpf)

            user.cpf = formattedCpf

            return this.usersRepository.save(user)
        }

        return this.usersRepository.save(user)
    }
}

export default UpdateProfileService
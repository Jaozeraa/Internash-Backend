import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import CreateUserService from '@modules/users/services/CreateUserService'
import ShowUsersService from '@modules/users/services/ShowUsersService'
import FindUserService from '@modules/users/services/FindUserService'

export default class UsersController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password, skill } = request.body

        const createUser = container.resolve(CreateUserService)
    
        const user = await createUser.execute({
            name,
            email,
            password,
            skill
        })
    
        return response.json(classToClass(user))
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.user
        const email = request.query.email as string

        if(email) {
            const findUser = container.resolve(FindUserService)
            const user = await findUser.execute({
                user_id: id,
                email
            })

            return response.json(classToClass(user))
        }

        const showUsers = container.resolve(ShowUsersService)
    
        const users = await showUsers.execute({
            user_id: id
        })
    
        return response.json(classToClass(users))
    }
}
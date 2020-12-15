import AppError from '@shared/errors/AppError'

import FindUserService from './FindUserService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

let fakeUsersRepository: FakeUsersRepository
let findUser: FindUserService

describe('FindUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        findUser = new FindUserService(fakeUsersRepository)
    })
    it('should be able to find a user', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        await fakeUsersRepository.create({
            name: "Test",
            email: "test@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const userFounded = await findUser.execute({
            user_id: user.id,
            email: 'test@example.com'
        })

        expect(userFounded?.name).toBe('Test')
    })
    it('should not be able to find yourself', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        expect(findUser.execute({
            user_id: user.id,
            email: user.email
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to find a user without logged', async () => {
        expect(findUser.execute({
            user_id: 'invalid_user_id',
            email: 'whatever'
        })).rejects.toBeInstanceOf(AppError)
    })
})
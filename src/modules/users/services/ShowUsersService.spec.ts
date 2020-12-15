import AppError from '@shared/errors/AppError'

import ShowUsersService from './ShowUsersService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

let fakeUsersRepository: FakeUsersRepository
let showUsers: ShowUsersService

describe('ShowUsers', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        showUsers = new ShowUsersService(fakeUsersRepository)
    })
    it('should be able to show users', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const anotherUser1 = await fakeUsersRepository.create({
            name: "Test1",
            email: "test1@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const anotherUser2 = await fakeUsersRepository.create({
            name: "Test2",
            email: "test2@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const users = await showUsers.execute({
            user_id: user.id
        })

        expect(users).toEqual([anotherUser2, anotherUser1])
    })

    it('should not be able to show users without logged', async () => {
        expect(showUsers.execute({
            user_id: 'invalid_user_id'
        })).rejects.toBeInstanceOf(AppError)
    })
})
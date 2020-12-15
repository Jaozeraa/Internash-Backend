import AppError from '@shared/errors/AppError'

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import UpdatePasswordService from './UpdatePasswordService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updatePassword: UpdatePasswordService

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeHashProvider = new FakeHashProvider()
        updatePassword = new UpdatePasswordService(fakeUsersRepository, fakeHashProvider)
    })
    it('should be able to update user password', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const updatedPassword = await updatePassword.execute({
            user_id: user.id,
            old_password: '123456',
            password: '123123'
        })

        expect(updatedPassword.password).toBe('123123')
    })
    it('should not be able to update password from non-existing user', async () => {
        expect(updatePassword.execute({
            user_id: 'non-existing-user-id',
            old_password: '123456',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError)
    })
    it('should not be able to update user password without the old user password', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        await expect(updatePassword.execute({
            user_id: user.id,
            password: '123123'
        })).rejects.toBeInstanceOf(AppError)
    })
    it('should not be able to update user password with a wrong old user password', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })
    
        await expect(updatePassword.execute({
            user_id: user.id,
            old_password: 'wrong-old-password',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError)
    })
})
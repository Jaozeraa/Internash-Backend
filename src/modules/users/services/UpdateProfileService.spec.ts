import AppError from '@shared/errors/AppError'

import UpdateProfileService from './UpdateProfileService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

let fakeUsersRepository: FakeUsersRepository
let updateProfile: UpdateProfileService

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        updateProfile = new UpdateProfileService(fakeUsersRepository, )
    })
    it('should be able to update user profile', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            skill: 'test',
        })

        expect(updatedUser.skill).toBe('test')
        expect(updatedUser.name).toBe('John Trê')
    })
    it('should not be able to update profile from non-existing user', async () => {
        expect(updateProfile.execute({
            user_id: 'non-existing-user-id',
            name: 'John Doe',
            email: 'johndoe@example.com',
            skill: 'whatever',
            cpf: '331.225.020-03'
        })).rejects.toBeInstanceOf(AppError)
    })
    it('should not be able to update email to another user email', async () => {
        await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const user = await fakeUsersRepository.create({
            name: 'Test',
            email: 'test@example.com',
            password: '123456',
            skill: 'whatever'
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
            skill: 'whatever'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should be able to update user cpf', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
            skill: 'whatever',
            cpf: '331.225.020-03'
        })

        expect(updatedUser.cpf).toBe('331.225.020-03')
    })

    it('should be able to update user cnpj', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
            skill: 'whatever',
            cpf: '06.135.984/0001-02'
        })

        expect(updatedUser.cpf).toBe('06.135.984/0001-02')
    })

    it('should be able to format cpf/cnpj', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
            skill: 'whatever',
            cpf: '33122502003'
        })

        expect(updatedUser.cpf).toBe('331.225.020-03')
    })

    it('should not be able to update user cpf/cnpj using a invalid cpf/cnpj', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })


        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
            skill: 'whatever',
            cpf: '1111111111111'
        })).rejects.toBeInstanceOf(AppError)
    })
})
import AppError from '@shared/errors/AppError'

import ShowProfileService from './ShowProfileService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

let fakeUsersRepository: FakeUsersRepository
let showProfile: ShowProfileService

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        showProfile = new ShowProfileService(fakeUsersRepository)
    })
    it('should be able to show user profile', async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            skill: 'whatever'
        })

        const profile = await showProfile.execute({
            user_id: user.id,
        })

        expect(profile.name).toBe('John Doe')
        expect(profile.email).toBe('johndoe@example.com')
    })
    it('should not be able to show profile from non-existing user', async () => {
        expect(showProfile.execute({
            user_id: 'non-existing-user-id',
        })).rejects.toBeInstanceOf(AppError)
    })
})
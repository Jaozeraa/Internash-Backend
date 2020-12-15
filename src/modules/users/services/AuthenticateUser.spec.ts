import AuthenticateUserService from '../services/AuthenticateUserService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository;
let authenticateUserService: AuthenticateUserService;
let fakeHashProvider: FakeHashProvider;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  })
  it('should be able to create a session', async () => {
    const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
        skill: 'whatever'
    });

    const response = await authenticateUserService.execute({
        email: user.email,
        password: user.password
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })
  it('should not be able to authenticate with non existing user', async () => {
    await expect(
        authenticateUserService.execute({
            email: "johndoe@example.com",
            password: '123123'
        })
    ).rejects.toBeInstanceOf(AppError)
})
it('should not be able to authenticate with wrong password', async () => {
    const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: "johndoe@example.com",
        password: '123123',
        skill: 'whatever'
    })

    await expect(
      authenticateUserService.execute({
        email: user.email,
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError)
})
});

import { isUuid } from 'uuidv4';

import CreateUserService from '../services/CreateUserService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let fakeHashProvider: FakeHashProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  })
  it('should be able to create an user', async () => {
    const user = await createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
        skill: 'whatever'
    });

    expect(user).toHaveProperty('id');
    expect(isUuid(user.id)).toBe(true);
  })
  it('should not be able to create an user with the same email as another user', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
      skill: 'whatever'
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
        skill: 'whatever'
    }),
    ).rejects.toBeInstanceOf(AppError);
  })
});

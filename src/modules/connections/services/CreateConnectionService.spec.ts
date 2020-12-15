import CreateConnectionService from './CreateConnectionService';
import FakeConnectionsRepository from '@modules/connections/repositories/fakes/FakeConnectionsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import AppError from '@shared/errors/AppError';

let createConnection: CreateConnectionService;
let fakeConnectionsRepository: FakeConnectionsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('CreateConnection', () => {
  beforeEach(() => {
    fakeConnectionsRepository = new FakeConnectionsRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createConnection = new CreateConnectionService(
      fakeConnectionsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to make a connection', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const anotherUser = await fakeUsersRepository.create({
      email: 'test@example.com',
      name: 'Test',
      password: '123',
      skill: 'whatever'
    });

    const connection = await createConnection.execute({
      user_id: user.id,
      connected_user_email: anotherUser.email
    });

    expect(connection).toHaveProperty('id');
  })
  it('should not be able to make a connection using a invalid user', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    await expect(
      createConnection.execute({
        connected_user_email: 'invalid_user_email',
        user_id: user.id
      }),
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to make a connection with yourself', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    await expect(
      createConnection.execute({
        connected_user_email: user.email,
        user_id: user.id
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
})
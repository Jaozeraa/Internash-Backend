import DeleteConnectionService from './DeleteConnectionService';
import CreateConnectionService from './CreateConnectionService';
import FakeConnectionsRepository from '@modules/connections/repositories/fakes/FakeConnectionsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import AppError from '@shared/errors/AppError';

let deleteConnection: DeleteConnectionService;
let createConnection: CreateConnectionService;
let fakeConnectionsRepository: FakeConnectionsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('DeleteConnection', () => {
  beforeEach(() => {
    fakeConnectionsRepository = new FakeConnectionsRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    deleteConnection = new DeleteConnectionService(
      fakeConnectionsRepository,
    )
    createConnection = new CreateConnectionService(
      fakeConnectionsRepository,
      fakeUsersRepository
    )
  });

  it('should be able to delete a connection', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const anotherUser1 = await fakeUsersRepository.create({
      email: 'test1@example.com',
      name: 'Test1',
      password: '123',
      skill: 'whatever'
    });

    const anotherUser2 = await fakeUsersRepository.create({
      email: 'test2@example.com',
      name: 'Test2',
      password: '123',
      skill: 'whatever'
    });

    const connection1 = await createConnection.execute({
      user_id: user.id,
      connected_user_email: anotherUser1.email
    });

    const connection2 = await createConnection.execute({
      user_id: user.id,
      connected_user_email: anotherUser2.email
    });

    await deleteConnection.execute({
      id: connection1.id
    })

    const connections = await fakeConnectionsRepository.findAllByUserId(user.id)

    expect(connections).toEqual([connection2]);
  })
  it('should not be able to delete a connection using a invalid connection', async () => {
    await expect(
      deleteConnection.execute({
        id: 'invalid_connection_id'
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
})
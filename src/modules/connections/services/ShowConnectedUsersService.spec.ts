import ShowConnectedUsersService from './ShowConnectedUsersService';
import CreateConnectionService from './CreateConnectionService';
import FakeConnectionsRepository from '@modules/connections/repositories/fakes/FakeConnectionsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import AppError from '@shared/errors/AppError';

let createConnection: CreateConnectionService;
let showConnectedUsers: ShowConnectedUsersService;
let fakeConnectionsRepository: FakeConnectionsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('ShowConnectedUsers', () => {
  beforeEach(() => {
    fakeConnectionsRepository = new FakeConnectionsRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createConnection = new CreateConnectionService(
      fakeConnectionsRepository,
      fakeUsersRepository,
    );
    showConnectedUsers = new ShowConnectedUsersService(
      fakeConnectionsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to show connected users', async () => {
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

    await createConnection.execute({
      user_id: user.id,
      connected_user_email: anotherUser1.email
    });

    await createConnection.execute({
      user_id: user.id,
      connected_user_email: anotherUser2.email
    });

    const connections = await showConnectedUsers.execute({
      user_id: user.id,
    })

    expect(connections[0].connected_user_id).toBe(anotherUser1.id);
    expect(connections[1].connected_user_id).toBe(anotherUser2.id);
  })
  it('should not be able to show all connections using a invalid user', async () => {
    await expect(
      showConnectedUsers.execute({
        user_id: 'invalid_user_id'
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
})
import CreateNotificationService from './CreateNotificationService';
import FakeNotificationsRepository from '../repositories/fakes/FakeNotificationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import AppError from '@shared/errors/AppError';

let createNotification: CreateNotificationService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('CreateNotification', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createNotification = new CreateNotificationService(
      fakeNotificationsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to create a notification', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const notification = await createNotification.execute({
      title: 'title test',
      description: 'description test',
      image_url: 'test.jpg',
      recipient_id: user.id,
    });

    expect(notification).toHaveProperty('id');
  })
  it('should not be able to create a notification to an invalid user', async () => {
    await expect(
      createNotification.execute({
        title: 'title test',
        description: 'description test',
        image_url: 'test.jpg',
        recipient_id: 'invalid-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
})
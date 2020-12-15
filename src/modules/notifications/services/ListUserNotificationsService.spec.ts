import CreateNotificationService from './CreateNotificationService';
import ListUserNotificationsService from './ListUserNotificationsService';
import FakeNotificationsRepository from '../repositories/fakes/FakeNotificationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import AppError from '@shared/errors/AppError';

let createNotification: CreateNotificationService;
let listUserNotifications: ListUserNotificationsService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('ListUserNotification', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createNotification = new CreateNotificationService(
      fakeNotificationsRepository,
      fakeUsersRepository,
    );
    listUserNotifications = new ListUserNotificationsService(
      fakeNotificationsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to list notifications', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const notification1 = await createNotification.execute({
      title: 'title test1',
      description: 'description test1',
      image_url: 'test1.jpg',
      recipient_id: user.id,
    });

    const notification2 = await createNotification.execute({
      title: 'title test2',
      description: 'description test2',
      image_url: 'test2.jpg',
      recipient_id: user.id,
    });

    const notifications = await listUserNotifications.execute({
      user_id: user.id,
    })

    expect(notifications).toEqual([notification1, notification2]);
  })
  it('should not be able to list notifications using a invalid user', async () => {
    await expect(
      listUserNotifications.execute({
        user_id: 'invalid-user',
      })
    ).rejects.toBeInstanceOf(AppError);
  })
})
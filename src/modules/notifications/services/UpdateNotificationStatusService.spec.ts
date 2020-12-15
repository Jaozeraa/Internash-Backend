import CreateNotificationService from './CreateNotificationService';
import UpdateNotificationStatusService from './UpdateNotificationStatusService';
import FakeNotificationsRepository from '../repositories/fakes/FakeNotificationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import AppError from '@shared/errors/AppError';

let createNotification: CreateNotificationService;
let updateNotificationStatus: UpdateNotificationStatusService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('UpdateNotificationStatus', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createNotification = new CreateNotificationService(
      fakeNotificationsRepository,
      fakeUsersRepository,
    );
    updateNotificationStatus = new UpdateNotificationStatusService(
      fakeNotificationsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to update notification status', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    await createNotification.execute({
      title: 'title test1',
      description: 'description test1',
      image_url: 'test1.jpg',
      recipient_id: user.id,
    });

    await createNotification.execute({
      title: 'title test2',
      description: 'description test2',
      image_url: 'test2.jpg',
      recipient_id: user.id,
    });

    await updateNotificationStatus.execute({
      user_id: user.id,
    })

    const notifications = await fakeNotificationsRepository.findAllByRecipientId(user.id);

    expect(notifications[0].read).toBe(true)
  })
  it('should not be able to update notifications status using a invalid user', async () => {
    await expect(
      updateNotificationStatus.execute({
        user_id: 'invalid-user',
      })
    ).rejects.toBeInstanceOf(AppError);
  })
})
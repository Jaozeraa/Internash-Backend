import "reflect-metadata"
import { injectable, inject } from 'tsyringe'

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError'

interface IRequest {
    user_id: string;
}

@injectable()
export default class UpdateNotificationStatusService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
    public async execute({ user_id }: IRequest): Promise<void> {
      const userExists = await this.usersRepository.findById(user_id);

      if (!userExists) {
        throw new AppError('This user id is invalid');
      }

      const notifications = await this.notificationsRepository.findAllByRecipientId(user_id)

      const unreadNotifications = notifications.filter(notification => !notification.read)

      unreadNotifications.forEach(async (notification) => {
        notification.read = true
        await this.notificationsRepository.save(notification)
      })

      return
    }
}
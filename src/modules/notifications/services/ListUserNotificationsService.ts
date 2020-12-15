import "reflect-metadata"
import { injectable, inject } from 'tsyringe'

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import Notification from '../infra/typeorm/entities/Notification';
import AppError from '@shared/errors/AppError'

interface IRequest {
    user_id: string;
}

@injectable()
export default class ListUserNotificationsService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
    public async execute({ user_id }: IRequest): Promise<Notification[]> {
      const userExists = await this.usersRepository.findById(user_id);

      if (!userExists) {
        throw new AppError('This user id is invalid');
      }

      const notifications = await this.notificationsRepository.findAllByRecipientId(user_id);

      return notifications;
    }
}
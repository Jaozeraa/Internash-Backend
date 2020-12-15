import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest extends ICreateNotificationDTO {}

@injectable()
export default class CreateNotificationService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ description, title, image_url, recipient_id }: IRequest) {
      const userExists = await this.usersRepository.findById(recipient_id);

      if (!userExists) {
        throw new AppError('This recipient id is invalid');
      }
    
      const notification = await this.notificationsRepository.create({
        description, 
        title, 
        image_url,
        recipient_id
      });

      return notification;
  }
}
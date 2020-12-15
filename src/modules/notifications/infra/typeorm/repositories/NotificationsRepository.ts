import { getRepository, Repository } from 'typeorm';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '@modules/notifications/infra/typeorm/entities/Notification';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: Repository<Notification>
  constructor() {
    this.ormRepository = getRepository(Notification)
  }
  public async create({
    recipient_id,
    description,
    image_url,
    title
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      description,
      recipient_id,
      image_url,
      title,
    });

    await this.ormRepository.save(notification);

    return notification;
  }

  public async save(notification: Notification): Promise<Notification> {
      return this.ormRepository.save(notification)
  }

  public async findAllByRecipientId(recipient_id: string): Promise<Notification[]> {
    const notifications = await this.ormRepository.find({
      where: { recipient_id },
    });

    return notifications;
  }
}

export default NotificationsRepository;

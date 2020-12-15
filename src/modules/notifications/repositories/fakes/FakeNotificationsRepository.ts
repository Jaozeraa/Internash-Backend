import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/entities/Notification';

export default class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];
  public async create({ description, recipient_id, image_url, title }: ICreateNotificationDTO) {
    const newNotification = new Notification();

    Object.assign(newNotification, { id: new ObjectID(), description, recipient_id, image_url, title, read: false });

    this.notifications.push(newNotification);

    return newNotification;
  }
  
  public async save(notification: Notification): Promise<Notification> {
      const chosenNotificationIndex = this.notifications.findIndex(findNotification => findNotification.id === notification.id);

      this.notifications[chosenNotificationIndex] = notification;

      return notification;
  }

  public async findAllByRecipientId(recipient_id: string): Promise<Notification[]> {
    const notificationsWithSameRecipientId = this.notifications.filter(findNotification => findNotification.recipient_id === recipient_id);
    
    return notificationsWithSameRecipientId;
  }
}
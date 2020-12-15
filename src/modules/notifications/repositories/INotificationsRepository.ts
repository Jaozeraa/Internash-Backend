import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import Notification from '../infra/typeorm/entities/Notification';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
  findAllByRecipientId(recipient_id: string): Promise<Notification[]>;
  save(notification: Notification): Promise<Notification>;
}
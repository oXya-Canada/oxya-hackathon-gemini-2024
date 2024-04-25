import { Notification } from '@/interfaces/notifications.interface';

export class HttpException extends Error {
  public status: number;
  public message: string;
  public create_notification: Notification;

  constructor(status: number, message: string, create_notification = null as Notification) {
    super(message);
    this.status = status;
    this.message = message;
    this.create_notification = create_notification;
  }
}

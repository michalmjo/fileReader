import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}
  private notifications: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);

  getNotifications() {
    return this.notifications.asObservable();
  }

  addNotification(message: string) {
    const currentNotifications = this.notifications.value;
    currentNotifications.push(message);
    this.notifications.next(currentNotifications);
  }

  removeNotification(index: number) {
    const currentNotifications = this.notifications.value;
    currentNotifications.splice(index, 1);
    this.notifications.next(currentNotifications);
  }
}

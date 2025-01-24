import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() index!: number;
  private timeout: number | undefined | any;
  @Input() message!: string;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.timeout = setTimeout(() => this.closeNotification(), 3000);
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  closeNotification() {
    this.notificationService.removeNotification(this.index);
  }
}

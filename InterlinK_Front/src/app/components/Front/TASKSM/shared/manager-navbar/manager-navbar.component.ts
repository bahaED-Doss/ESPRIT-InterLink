import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../Services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manager-navbar',
  templateUrl: './manager-navbar.component.html',
  styleUrls: ['./manager-navbar.component.css']
})
export class ManagerNavbarComponent implements OnInit, OnDestroy {
  notificationCount: number = 0;
  managerId: number = 1; // Default manager ID
  @Output() createTask = new EventEmitter<void>();
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    // Subscribe to notification count updates
    this.subscription.add(
      this.notificationService.unreadCount$.subscribe(count => {
        this.notificationCount = count;
      })
    );
    
    // Start polling for notifications
    this.notificationService.startPolling(this.managerId);
    
    // Initial load of notifications
    this.notificationService.getNotifications(this.managerId).subscribe();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions and stop polling
    this.subscription.unsubscribe();
    this.notificationService.stopPolling();
  }

  onCreateTask(): void {
    this.createTask.emit();
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> cf28fa5 (integration front)

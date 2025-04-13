import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../Services/notification.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'; // Add Router import
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() userId: number = 1; // Default user ID
  
  notifications: Notification[] = [];
  showNotifications = false;
  unreadCount = 0;
  
  private subscription: Subscription = new Subscription();
  
  constructor(
    private notificationService: NotificationService,
    private router: Router // Add Router dependency
  ) { }
  
  ngOnInit(): void {
    // Subscribe to notifications
    this.subscription.add(
      this.notificationService.getNotifications(this.userId).subscribe(notifications => {
        // Map TaskNotification to Notification
        this.notifications = notifications.map(n => ({
          id: n.id || 0,
          message: n.message,
          // Map the task notification types to our allowed types
          type: this.mapNotificationType(n.type),
          timestamp: n.timestamp,
          isRead: n.isRead || false,
          relatedTaskId: n.taskId,
          userId: n.userId || this.userId // Add the userId property
        }));
        
        // Update unread count
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
      })
    );
    
    // Start polling for notifications
    this.notificationService.startPolling(this.userId);
  }
  
  ngOnDestroy(): void {
    // Stop polling and clean up subscriptions
    this.notificationService.stopPolling();
    this.subscription.unsubscribe();
  }
  
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe();
      notification.isRead = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    }
  }
  
  markAllAsRead(): void {
    this.notificationService.markAllAsRead(this.userId).subscribe();
    this.notifications.forEach(n => n.isRead = true);
    this.unreadCount = 0;
  }
  
  // Helper method to map task notification types to our allowed types
  // Add to the mapNotificationType method
  private mapNotificationType(type: string): 'info' | 'success' | 'warning' | 'error' {
    switch(type) {
      case 'TASK_CREATED':
        return 'info';
      case 'TASK_UPDATED':
        return 'success';
      case 'TASK_DELETED':
        return 'warning';
      case 'STATUS_CHANGED':
        return 'info';
      case 'FEEDBACK_ADDED':
        return 'success'; // Use success for new feedback
      case 'FEEDBACK_UPDATED':
        return 'info'; // Use info for updated feedback
      default:
        return 'info';
    }
  }
  
  // Add these methods to your NotificationComponent class
  getDateFromTimestamp(timestamp: string): Date {
    return new Date(timestamp);
  }
  // Helper method to get the appropriate icon for each notification type
  getNotificationIcon(type: string): string {
    switch(type) {
      case 'info':
        return 'fa-info-circle';
      case 'success':
        return 'fa-check-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'error':
        return 'fa-times-circle';
      default:
        return 'fa-bell';
    }
  }
  
  // Helper method to format the timestamp
  getNotificationTimeString(timestamp: Date): string {
    if (!timestamp) {
      return 'Just now';
    }
    
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
      // Format as date
      return notificationTime.toLocaleDateString();
    }
  }
  
  // Add a method to handle notification clicks
  onNotificationClick(notification: Notification): void {
    // Mark as read first
    this.markAsRead(notification);
    
    // Handle different notification types
    if (notification.type === 'success' && notification.relatedTaskId) {
      // This could be a feedback notification or task update
      // Navigate to the task details with the feedback panel open
      this.router.navigate(['/student/tasks'], { 
        queryParams: { 
          openTask: notification.relatedTaskId,
          openFeedback: true
        } 
      });
    } else if (notification.relatedTaskId) {
      // For other task-related notifications
      this.router.navigate(['/student/tasks'], { 
        queryParams: { openTask: notification.relatedTaskId } 
      });
    }
  }
}

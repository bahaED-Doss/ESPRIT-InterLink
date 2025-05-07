import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer, of } from 'rxjs';
import { TaskService, TaskNotification } from './task.service';
import { RxStomp } from '@stomp/rx-stomp';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<TaskNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();
  private dateToString(date: Date): string { return date.toISOString();}
  private rxStomp: RxStomp;
  private connected = false;
  private pollingSubscription: Subscription | null = null;

  constructor(private taskService: TaskService) {
    // Initialize RxStomp for WebSocket connection
    this.rxStomp = new RxStomp();
    
    // Subscribe to task service notifications (for non-WebSocket fallback)
    this.taskService.notifications$.subscribe(notifications => {
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount();
    });
  }
  
  // Start polling for notifications
  startPolling(userId: number, interval: number = 5000): void {
    // Stop any existing polling
    this.stopPolling();
    
    console.log(`Starting notification polling for user ${userId} every ${interval}ms`);
    
    // Initial fetch
    this.fetchNotifications(userId);
    
    // Set up polling
    this.pollingSubscription = timer(interval, interval).pipe(
      switchMap(() => {
        console.log(`Polling notifications for user ${userId}`);
        return this.taskService.getNotificationsForUser(userId);
      })
    ).subscribe({
      next: (notifications) => {
        console.log(`Received ${notifications.length} notifications`);
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Error polling notifications:', error);
      }
    });
  }
  
  // Stop polling
  stopPolling(): void {
    if (this.pollingSubscription) {
      console.log('Stopping notification polling');
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }
  
  // Connect to WebSocket server
  connectWebSocket(userId: number): void {
    if (this.connected) {
      console.log('WebSocket already connected');
      return;
    }
    
    const serverUrl = 'http://localhost:8085/Interlink/ws';
    console.log(`Connecting to WebSocket at ${serverUrl}`);
    
    // Configure RxStomp
    this.rxStomp.configure({
      webSocketFactory: () => new SockJS(serverUrl),
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000,
      debug: (msg: string): void => {
        console.log(`WebSocket: ${msg}`);
      }
    });
    
    // Connect to the WebSocket server
    this.rxStomp.activate();
    
    // Subscribe to user-specific notification channel
    this.rxStomp.watch(`/topic/notifications/${userId}`).subscribe(message => {
      try {
        const notification = JSON.parse(message.body) as TaskNotification;
        console.log('Received notification via WebSocket:', notification);
        
        // Add to current notifications
        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next([notification, ...currentNotifications]);
        this.updateUnreadCount();
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Subscribe to project updates channel
    this.rxStomp.watch('/topic/project-updates').subscribe(message => {
      try {
        const update = JSON.parse(message.body);
        console.log('Received project update via WebSocket:', update);
        
        // Refresh tasks if needed
        if (update.projectId) {
          this.taskService.refreshTasksForProject(update.projectId);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    this.connected = true;
    console.log('WebSocket connection established');
  }
  
  // Disconnect WebSocket
  disconnectWebSocket(): void {
    if (this.connected) {
      this.rxStomp.deactivate();
      this.connected = false;
      console.log('WebSocket disconnected');
    }
  }
  
  // Fetch notifications for a user with better error handling
  // Update the fetchNotifications method to handle the user not found error
  
  // Add a property to store the selected user ID
  private selectedUserId: number | null = null;
  
  // Add a method to set the selected user ID
  setSelectedUser(userId: number): void {
    console.log(`Setting selected user ID to ${userId}`);
    this.selectedUserId = userId;
    
    // Fetch notifications for the newly selected user
    if (userId) {
      this.fetchNotifications(userId);
      
      // If WebSocket is enabled, reconnect with the new user ID
      if (this.connected) {
        this.disconnectWebSocket();
        this.connectWebSocket(userId);
      }
      
      // Restart polling with the new user ID
      if (this.pollingSubscription) {
        this.stopPolling();
        this.startPolling(userId);
      }
    }
  }
  
  // Get the current selected user ID
  getSelectedUserId(): number {
    // If no user is selected, return a default value or throw an error
    if (!this.selectedUserId) {
      console.warn('No user selected, using default user ID 2');
      return 2; // Default to user ID 2 as a fallback
    }
    return this.selectedUserId;
  }
  
  // Update the fetchNotifications method to use the selected user ID if no ID is provided
  fetchNotifications(userId?: number): void {
    // Use provided userId or fall back to selected user
    const userIdToUse = userId || this.getSelectedUserId();
  
    console.log(`Fetching notifications for user ${userIdToUse}`);
  
    // Don't try to fetch notifications if userId is 0 or undefined
    if (!userIdToUse) {
      console.warn('Invalid user ID, skipping notification fetch');
      this.notificationsSubject.next([]);
      return;
    }
    
    this.taskService.getNotificationsForUser(userIdToUse)
      .pipe(
        catchError((error: any) => {
          console.warn('Error fetching notifications from API, using local data:', error);
          // Return empty array when API fails
          return of([]);
        })
      )
      .subscribe({
        next: (notifications: TaskNotification[]) => {
          console.log(`Received ${notifications.length} notifications for user ${userIdToUse}`);
          this.notificationsSubject.next(notifications);
          this.updateUnreadCount();
        },
        error: (error: any) => {
          console.error('Error in notification subscription:', error);
          // Set empty array to prevent UI issues
          this.notificationsSubject.next([]);
        }
      });
  }
  
  // Update the getNotifications method to use the selected user ID if no ID is provided
  // Update unread count
  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }
  
  // Get all notifications for a specific user
  getNotifications(userId?: number): Observable<TaskNotification[]> {
    const userIdToUse = userId || this.getSelectedUserId();
  
    // If userId is provided or we have a selected user, fetch notifications
    if (userIdToUse) {
      this.fetchNotifications(userIdToUse);
    }
    return this.notifications$;
  }
  
  // Get unread count
  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }
  
  // Add a notification (for components to use)
  addNotification(notification: Notification): Observable<void> {
    console.log('Adding notification:', notification);
    
    // Make sure we have a valid userId
    if (!notification.userId) {
      console.warn('No userId provided for notification, using default value');
    }
    
    // Convert to TaskNotification format
    const taskNotification: TaskNotification = {
      id: notification.id,
      type: 'TASK_UPDATED', // Default type
      taskId: notification.relatedTaskId || 0,
      message: notification.message,
      timestamp: typeof notification.timestamp === 'string' 
    ? notification.timestamp 
    : this.dateToString(notification.timestamp),
      isRead: notification.isRead,
      userId: notification.userId || 0, // Make sure this is the correct user ID
      senderId: 0 // Default sender
    };
    
    console.log(`Adding notification for user ${taskNotification.userId}`);
    
    // Add to current notifications
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([taskNotification, ...currentNotifications]);
    this.updateUnreadCount();
    
    // Also send to the task service to persist
    this.taskService.addNotification(taskNotification);
    
    // Return an observable that completes immediately
    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }
  
  // Mark a notification as read
  markAsRead(notificationId: number): Observable<void> {
    this.taskService.markNotificationAsRead(notificationId);
    
    // Update local state as well
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    
    // Send read status to server via WebSocket if connected
    if (this.connected) {
      this.rxStomp.publish({
        destination: '/app/notifications/read',
        body: JSON.stringify({ notificationId })
      });
    }
    
    // Return an observable that completes immediately
    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }
  
  // Mark all notifications as read
  markAllAsRead(userId: number): Observable<void> {
    const currentNotifications = this.notificationsSubject.value;
    currentNotifications.forEach(notification => {
      if (!notification.isRead && notification.userId === userId) {
        this.taskService.markNotificationAsRead(notification.id || 0);
      }
    });
    
    // Update local state
    const updatedNotifications = currentNotifications.map(notification => 
      notification.userId === userId ? { ...notification, isRead: true } : notification
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    
    // Send read all status to server via WebSocket if connected
    if (this.connected) {
      this.rxStomp.publish({
        destination: '/app/notifications/read-all',
        body: JSON.stringify({ userId })
      });
    }
    
    // Return an observable that completes immediately
    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> cf28fa5 (integration front)

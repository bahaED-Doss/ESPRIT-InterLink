import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../Services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-navbar',
  templateUrl: './student-navbar.component.html',
  styleUrls: ['./student-navbar.component.css']
})
export class StudentNavbarComponent implements OnInit, OnDestroy {
  notificationCount: number = 0;
  studentId: number = 1; // Add this property
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    // For demo purposes, we'll set a random notification count
    // In a real app, this would come from a notification service
    this.notificationCount = Math.floor(Math.random() * 12);
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscription.unsubscribe();
    
    // If you're using the notification service polling, stop it
    this.notificationService.stopPolling();
  }
}

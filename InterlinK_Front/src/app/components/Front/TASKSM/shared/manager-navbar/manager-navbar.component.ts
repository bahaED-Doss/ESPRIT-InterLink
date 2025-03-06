import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-manager-navbar',
  templateUrl: './manager-navbar.component.html',
  styleUrls: ['./manager-navbar.component.css']
})
export class ManagerNavbarComponent implements OnInit {
  notificationCount: number = 0;
  @Output() createTask = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
    // For demo purposes, we'll set a random notification count
    // In a real app, this would come from a notification service
    this.notificationCount = Math.floor(Math.random() * 12);
  }

  onCreateTask(): void {
    this.createTask.emit();
  }
}

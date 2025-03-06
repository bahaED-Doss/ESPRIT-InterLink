import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-navbar',
  templateUrl: './student-navbar.component.html',
  styleUrls: ['./student-navbar.component.css']
})
export class StudentNavbarComponent implements OnInit {
  notificationCount: number = 0;

  constructor() { }

  ngOnInit(): void {
    // For demo purposes, we'll set a random notification count
    // In a real app, this would come from a notification service
    this.notificationCount = Math.floor(Math.random() * 12);
  }
}

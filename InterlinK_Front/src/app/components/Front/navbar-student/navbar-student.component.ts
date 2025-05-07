import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-student',
  templateUrl: './navbar-student.component.html',
  styleUrls: ['./navbar-student.component.css']
})
export class NavbarStudentComponent implements OnInit {
  profileLink: string = '/profileStudent';
  documentLink: string = '/documents'; // default value

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Retrieve userId from localStorage (set during login)
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Update the profile link with the user id
      this.profileLink = `/profileStudent/${userId}`;
      this.documentLink = `/documents/${userId}`;
    }
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-hr',
  templateUrl: './navbar-hr.component.html',
  styleUrls: ['./navbar-hr.component.css']
})
export class NavbarHrComponent {
 profileLink: string = '/profileHr'; // default value

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Retrieve userId from localStorage (set during login)
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Update the profile link with the user id
      this.profileLink = `/profileHr/${userId}`;
    }
  }
}

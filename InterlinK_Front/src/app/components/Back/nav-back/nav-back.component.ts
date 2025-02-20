import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-nav-back',
  standalone: true,
  imports: [RouterOutlet,
    RouterLink,
    RouterLinkActive],
  templateUrl: './nav-back.component.html',
  styleUrls: ['./nav-back.component.css']
})
export class NavBackComponent {
  constructor(private router: Router) {}
  logout() {
    // Perform any cleanup actions, like clearing tokens or session data
    //localStorage.removeItem('authToken'); // Example: Remove token from local storage

    // Navigate to the sign-in page
    this.router.navigate(['/login']);
  }

}

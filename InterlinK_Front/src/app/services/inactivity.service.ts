import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InactivityService {

  private inactivityTimeout: any;
  private readonly INACTIVITY_LIMIT = 30000;  // 30 seconds
  private userInactiveSubject: Subject<void> = new Subject<void>();
  inactivityLogoutEnabled: boolean = false;
  inactivityDetected$ = new BehaviorSubject<boolean>(false); // Correct type
  constructor(private router: Router) {
    this.startInactivityTimer();
    this.setupInactivityListeners();
  }

  // Start the inactivity timer
  private startInactivityTimer(): void {
    this.resetInactivityTimer();
    // Listen for mouse and keyboard events
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keydown', this.resetInactivityTimer.bind(this));
  }
// Set the preference for inactivity logout
// Start detecting inactivity when enabled
setInactivityLogout(enabled: boolean) {
  this.inactivityLogoutEnabled = enabled;

  if (enabled) {
    // Start detecting inactivity after enabling the feature
    this.startInactivityTimer(); // Start the timer for inactivity detection
  } else {
    // Stop inactivity detection if it's disabled
    clearTimeout(this.inactivityTimeout);
  }
}

  // Reset the inactivity timer
 // Reset the inactivity timer (restart it on any activity)
private resetInactivityTimer(): void {
  if (this.inactivityTimeout) {
    clearTimeout(this.inactivityTimeout); // Clear existing timeout
  }
  

  // Set the timeout to logout the user after 30 seconds of inactivity
  this.inactivityTimeout = setTimeout(() => this.onInactivity(), this.INACTIVITY_LIMIT);
}

  private setupInactivityListeners() {
    if (!this.inactivityLogoutEnabled) return; // If the feature is disabled, do nothing

    const resetTimeout = () => {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = setTimeout(() => {
        this.inactivityDetected$.next(true); // Trigger inactivity event
      }, 30000); // 30 seconds of inactivity
    };

    // Listen for mouse and keyboard events
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);

    // Initial call to start the timer
    resetTimeout();
  }
  // Handle inactivity
  private onInactivity(): void {
    this.logout(); // Logout the user after inactivity
  }
  // Log out the user and redirect to login
  private logout(): void {
    // Optionally clear user data from localStorage or sessionStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']); // Navigate to the login page
  }

  // Observable to notify components when the user is inactive
 
}

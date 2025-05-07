import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/UserS/auth.service';

import { InactivityService } from 'src/app/services/UserS/inactivity.service';
@Component({
  selector: 'app-hr-profile',
  templateUrl: './hr-profile.component.html',
  styleUrls: ['./hr-profile.component.css']
})
export class HrProfileComponent implements OnInit, OnDestroy {
  user: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private inactivityService: InactivityService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.authService.getUserById(id).subscribe((user) => {
      this.user = user;
    });
   
  }
  ngOnDestroy(): void {
    // Cleanup on component destroy (if needed)
    if (this.inactivityService) {
      // Perform any necessary cleanup or unsubscribe
    }
  }
}

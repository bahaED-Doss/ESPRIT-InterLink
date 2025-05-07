// user-statistics.component.ts
import { Component, OnInit } from '@angular/core';
import { interval, take } from 'rxjs';
import { AuthService } from 'src/app/services/UserS/auth.service';
import { User, Role } from 'src/app/models/user';

export interface Stat {
  label: string;
  role?: string;
  count: number;
  currentCount: number;
  iconClass: string;
}

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit {
  users: User[] = [];
  statistics: Stat[] = [
    {
      label: 'Students',
      role: Role.STUDENT,
      count: 0,
      currentCount: 0,
      iconClass: 'fas fa-user-graduate'
    },
    {
      label: 'HR',
      role: Role.HR,
      count: 0,
      currentCount: 0,
      iconClass: 'fas fa-user-tie'
    },
    {
      label: 'Project Managers',
      role: Role.PROJECT_MANAGER,
      count: 0,
      currentCount: 0,
      iconClass: 'fas fa-briefcase'
    },
    {
      label: 'Admins',
      role: Role.ADMIN,
      count: 0,
      currentCount: 0,
      iconClass: 'fas fa-user-shield'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      this.calculateStatistics();
    });
  }

  calculateStatistics(): void {
    this.statistics.forEach(stat => {
      if (stat.role) {
        stat.count = this.users.filter(user => user.role === stat.role).length;
      } else {
        stat.count = this.users.length;
      }
      this.animateCount(stat);
    });
  }

  animateCount(stat: Stat): void {
    const duration = 1000; // total duration in milliseconds
    const steps = 50;      // number of steps for animation
    const increment = stat.count / steps;
    let current = 0;
    const source = interval(duration / steps).pipe(take(steps));
    source.subscribe({
      next: () => {
        current += increment;
        stat.currentCount = Math.round(current);
      },
      complete: () => {
        stat.currentCount = stat.count;
      }
    });
  }
}

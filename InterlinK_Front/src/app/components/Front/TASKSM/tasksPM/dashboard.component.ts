import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <div class="card-container">
        <div class="card">
          <h3>Task Management</h3>
          <p>Manage your project tasks with our Kanban board</p>
          <button class="btn-primary" (click)="navigateToTasks()">
            <i class="lni lni-chevron-right"></i> Go to Tasks
          </button>
        </div>
        <!-- Add more cards for other features -->
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 30px;
    }
    .card-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 30px;
    }
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      padding: 20px;
      width: 300px;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .btn-primary:hover {
      background-color: #0069d9;
    }
  `]
})
export class DashboardComponent {
  
  constructor(private router: Router) {}
  
  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }
}
//import { Component } from '@angular/core';

//@Component({
//  selector: 'app-root',
//  templateUrl: './app.component.html',
//  styleUrls: ['./app.component.css']
//})
//export class AppComponent {
//  title = 'InterlinK_Front';
//}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav class="main-nav">
      <div class="container">
        <a routerLink="/" class="nav-brand">Project Management</a>
        <ul class="nav-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a></li>
          <li><a routerLink="/tasks" routerLinkActive="active">Tasks</a></li>
        </ul>
      </div>
    </nav>
    
    <main>
      <router-outlet></router-outlet>
    </main>
    
    <footer class="main-footer">
      <div class="container">
        <p>&copy; 2025 Project Management System</p>
      </div>
    </footer>
  `,
  styles: [`
    .main-nav {
      background-color: #343a40;
      padding: 15px 0;
    }
    .container {
      width: 90%;
      max-width: 1200px;
      margin: 0 auto;
    }
    .nav-brand {
      color: white;
      font-size: 20px;
      font-weight: bold;
      text-decoration: none;
    }
    .nav-links {
      display: inline-flex;
      list-style: none;
      margin: 0 0 0 30px;
      padding: 0;
    }
    .nav-links li {
      margin-right: 15px;
    }
    .nav-links a {
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 3px;
    }
    .nav-links a:hover, .nav-links a.active {
      color: white;
      background-color: rgba(255,255,255,0.1);
    }
    main {
      min-height: calc(100vh - 130px);
    }
    .main-footer {
      background-color: #f8f9fa;
      padding: 20px 0;
      margin-top: 50px;
    }
  `]
})
export class AppComponent {
  title = 'project-management-app';
}
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { ProjectService } from '../../Services/projectstatic.service';
import { NotificationService } from '../../Services/notification.service';

interface ProjectSelection {
  projectId: number;
  managerId: number;
}

@Component({
  selector: 'app-task-selection',
  templateUrl: './task-selection.component.html',
  styleUrls: ['./task-selection.component.css']
})
export class TaskSelectionComponent implements OnInit {
  managers: any[] = [];
  projects: any[] = [];
  tasks: any[] = [];
  selectedManagerId: string = '';
  selectedProjectId: string = '';

  @Output() projectSelected = new EventEmitter<ProjectSelection>();

  constructor(
    private taskService: TaskService, 
    private projectService: ProjectService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadManagers();
  }

  loadManagers() {
    this.taskService.getProjectManagers().subscribe({
      next: (data: any) => {
        this.managers = data;
        console.log('Managers loaded:', data);
      },
      error: (error: any) => {
        console.error('Error loading managers:', error);
      }
    });
  }

  loadProjects() {
    if (this.selectedManagerId) {
      this.projectService.getProjectsByUserId(Number(this.selectedManagerId)).subscribe({
        next: (data: any) => {
          this.projects = data;
          console.log('Projects loaded:', data);
          this.tasks = [];
          this.loadTasks();
        },
        error: (error: any) => {
          console.error('Error loading projects:', error);
        }
      });
    }
  }

  loadTasks() {
    if (this.selectedProjectId) {
      console.log('Fetching tasks for project:', this.selectedProjectId);
      this.taskService.getTasksByProjectId(Number(this.selectedProjectId)).subscribe({
        next: (data: any) => {
          this.tasks = data;
          console.log('Tasks loaded successfully:', data);
        },
        error: (error: any) => {
          console.error('Error loading tasks:', error);
        }
      });
    }
  }

  onManagerChange() {
    this.selectedProjectId = '';
    
    if (this.selectedManagerId) {
      const managerId = Number(this.selectedManagerId);
      
      // Set the selected user ID in the notification service
      this.notificationService.setSelectedUser(managerId);
      
      // Start polling for notifications for this manager
      this.notificationService.startPolling(managerId);
      
      this.loadProjects();
      this.loadTasks();
      this.projectSelected.emit({ 
        projectId: 1, 
        managerId: managerId 
      });
    }
  }

  onProjectChange() {
    if (this.selectedProjectId && this.selectedManagerId) {
      const projectId = Number(this.selectedProjectId);
      const managerId = Number(this.selectedManagerId);

      if (!isNaN(projectId) && !isNaN(managerId)) {
        console.log('Emitting project selection:', { projectId, managerId });
        this.projectSelected.emit({ projectId, managerId });
        this.tasks = [];
      }
    }
  }
}
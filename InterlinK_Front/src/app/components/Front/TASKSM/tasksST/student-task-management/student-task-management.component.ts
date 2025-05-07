import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { UserService } from '../../Services/user.service';
import { NotificationService } from '../../Services/notification.service';
import { Task } from '../../models/task.model';
import { StatusChangeEvent } from '../student-task-board/student-task-board.component';
import { Subscription } from 'rxjs';

// Define interfaces for Student and Project
interface Student {
  id: number;
  name: string;
  email?: string;
  projectId?: number; // Add projectId to the student interface
}

interface Project {
  projectId: number;
  name: string;
  description?: string;
  managerId?: number; // Add managerId to the Project interface
}

// Import the StudentSelection interface
interface StudentSelection {
  studentId: number;
  projectId?: number;
}

@Component({
  selector: 'app-student-task-management',
  templateUrl: './student-task-management.component.html',
  styleUrls: ['./student-task-management.component.css']
})
// In the component class, make sure you have a managerId property
export class StudentTaskManagementComponent implements OnInit , OnDestroy {
  selectedStudentId: number = 0;
  selectedProjectId: number = 0;
  selectedStudent: Student | null = null;
  tasks: Task[] = [];
  loading: boolean = false;
  error: string | null = null;
  noProjectAssigned: boolean = false;
  managerId: number = 0; // Add managerId property
  private subscriptions: Subscription[] = [];

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Initialize component
    console.log('Student Task Management Component initialized');
  }

  onStudentSelected(event: StudentSelection): void {
    console.log('Student selected event received:', event);
    this.selectedStudentId = event.studentId;
    this.loading = true;
    this.error = null;
    this.noProjectAssigned = false;
  
    // Fetch student details
    this.userService.getStudentById(this.selectedStudentId).subscribe({
      next: (student: Student) => {
        console.log('Student details loaded:', student);
        this.selectedStudent = student;
        this.notificationService.connectWebSocket(this.selectedStudentId);
  
        // Start faster polling (5 seconds instead of 30)
        this.notificationService.startPolling(this.selectedStudentId, 5000);
        // Fetch the project assigned to the student
        this.userService.getProjectByStudentId(this.selectedStudentId).subscribe({
          next: (project: Project) => {
            console.log('Project details loaded:', project);
  
            // Check if the project ID is valid
            if (project.projectId) {
              this.selectedProjectId = project.projectId;
              this.loadTasksByProjectId(this.selectedProjectId); // Load tasks for the project
              
              // Get the manager ID for the project if available
              if (project.managerId) {
                this.managerId = project.managerId;
              }
            } else {
              this.noProjectAssigned = true;
              this.loading = false;
            }
          },
          error: (error: any) => {
            console.error('Error fetching project:', error);
            this.error = 'Failed to fetch project details.';
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Error loading student details:', error);
        this.error = 'Failed to load student details.';
        this.loading = false;
      }
    });
  }

  loadTasksByProjectId(projectId: number): void {
    this.taskService.getTasksByProjectId(projectId).subscribe({
      next: (data: Task[]) => {
        console.log('Tasks loaded:', data);
        this.tasks = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading tasks:', error);
        this.error = 'Failed to load tasks.';
        this.loading = false;
      }
    });
  }

  // Update the method to accept the correct parameter type
  onStatusChanged(event: StatusChangeEvent): void {
    // Log the event to help debug
    console.log('Status change event received:', event);
    
    // Validate the data before making the API call
    if (!event.taskId || event.taskId <= 0) {
      console.error('Invalid task ID in status change event:', event);
      return;
    }
    
    // Handle the status change
    const { taskId, newStatus, userId } = event;
    
    // Make sure we have a valid user ID
    const userIdToUse = this.selectedStudentId;
    console.log('Using user ID for update:', userIdToUse);
    
    // Your existing logic to update the task status
    this.taskService.updateTaskStatus(
      this.selectedProjectId,
      userIdToUse, // Use the selected student ID directly
      taskId,
      newStatus
    ).subscribe({
      next: (updatedTask) => {
        console.log('Task status updated:', updatedTask);
        // Update local task data if needed
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        // Optionally revert the UI change if the API call fails
      }
    });
  }
  ngOnDestroy() {
    this.notificationService.disconnectWebSocket();
    this.notificationService.stopPolling();
    // ... any other cleanup code ...
  }
  // Add these properties
  selectedManagerId: number = 1; // Default manager ID
  
  // Add this method to handle task details view
  onViewTaskDetails(task: Task): void {
    console.log('Viewing task details:', task);
    // Implement your task details view logic here
    // For example, you could open a modal or navigate to a details page
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> cf28fa5 (integration front)

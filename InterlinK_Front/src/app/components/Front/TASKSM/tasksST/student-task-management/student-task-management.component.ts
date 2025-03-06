import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { UserService } from '../../Services/user.service';
import { Task } from '../../models/task.model';


// Define interfaces for Student and Project
interface Student {
  id: number;
  name: string;
  email?: string;
}

interface Project {
  projectId: number;
  name: string;
  description?: string;
}

// Import the StudentSelection interface
interface StudentSelection {
  studentId: number;
  projectId: number;
}

// Import StatusChangeEvent interface
interface StatusChangeEvent {
  taskId: number;
  newStatus: string;
  userId: number;
}



interface Student {
  id: number;
  name: string;
  email?: string;
  projectId?: number; // Add projectId to the student interface
}

interface StudentSelection {
  studentId: number;
}

@Component({
  selector: 'app-student-task-management',
  templateUrl: './student-task-management.component.html',
  styleUrls: ['./student-task-management.component.css']
})
export class StudentTaskManagementComponent implements OnInit {
  selectedStudentId: number = 0;
  selectedProjectId: number = 0;
  selectedStudent: Student | null = null;
  tasks: Task[] = [];
  loading: boolean = false;
  error: string | null = null;
  noProjectAssigned: boolean = false;

  constructor(
    private taskService: TaskService,
    private userService: UserService
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
  
        // Fetch the project assigned to the student
        this.userService.getProjectByStudentId(this.selectedStudentId).subscribe({
          next: (project: Project) => {
            console.log('Project details loaded:', project);
  
            // Check if the project ID is valid
            if (project.projectId) {
              this.selectedProjectId = project.projectId;
              this.loadTasksByProjectId(this.selectedProjectId); // Load tasks for the project
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

  onStatusChanged(event: { task: Task; newStatus: string }): void {
    const { task, newStatus } = event;
    console.log(`Updating task ${task.taskId} status to ${newStatus}`);
  
    // Ensure the newStatus is valid
    const validStatus = newStatus as 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  
    // Call the backend to update the task status
    this.taskService.updateTaskStatus(
      this.selectedProjectId,
      task.taskId!,
      this.selectedStudentId,
      validStatus
    ).subscribe({
      next: () => {
        console.log('Task status updated successfully');
        // Update the task status in the local tasks array
        const taskIndex = this.tasks.findIndex(t => t.taskId === task.taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex].status = validStatus;
        }
      },
      error: (error: any) => {
        console.error('Error updating task status:', error);
        // Revert the change in the UI
        this.loadTasksByProjectId(this.selectedProjectId);
      }
    });
  }
}
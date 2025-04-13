import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { NotificationService } from '../../Services/notification.service';
import { Task } from '../../models/task.model';
import { Notification } from '../../models/notification.model'; // Add this import
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html'
})
export class TaskManagementComponent implements OnInit, OnDestroy {
  selectedManagerId: number = 0;
  selectedProjectId: number = 0;
  tasks: Task[] = [];
  newTask: Task = this.getEmptyTask();
  isEditing: boolean = false;
  isDrawerOpen: boolean = false;
  private pollingSubscription?: Subscription;
  private subscriptions: Subscription = new Subscription();
  private dateToString(date: Date): string {
    return date.toISOString();
  }

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopPolling();
    this.subscriptions.unsubscribe();
  }

  onProjectSelected(event: {projectId: number, managerId: number}) {
    this.selectedProjectId = event.projectId;
    this.selectedManagerId = event.managerId;
    if (this.selectedProjectId > 0) {
      this.loadTasks();
      this.startPolling();
    } else {
      this.stopPolling();
    }
  }

  startPolling(): void {
    // Stop any existing polling
    this.stopPolling();
    
    // Start polling every 10 seconds
    this.pollingSubscription = interval(10000)
      .pipe(
        switchMap(() => this.taskService.getTasks(this.selectedProjectId))
      )
      .subscribe({
        next: (data) => {
          this.tasks = data;
        },
        error: (error) => console.error('Error polling tasks:', error)
      });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  loadTasks() {
    this.taskService.getTasks(this.selectedProjectId).subscribe({
      next: (data) => {
        this.tasks = data;
        console.log('Tasks loaded:', data);
      },
      error: (error) => console.error('Error loading tasks:', error)
    });
  }

  openCreateTaskDrawer() {
    if (this.selectedProjectId > 0) {
      this.newTask = this.getEmptyTask();
      this.isEditing = false;
      this.isDrawerOpen = true;
    }
  }

  closeTaskDrawer() {
    this.isDrawerOpen = false;
    this.loadTasks();
  }

  saveTask(task: Task) {
    console.log('Saving task:', task);
    
    this.taskService.createTask(
      this.selectedProjectId,
      this.selectedManagerId,
      task
    ).subscribe({
      next: (response) => {
        console.log('Task created:', response);
        this.loadTasks();
        this.closeTaskDrawer();
        
        // Get the student ID from the created task
        const studentId = response.student?.id;
        
        if (studentId) {
          // Add notification for the student
          this.notificationService.addNotification({
            id: Date.now(),
            userId: studentId,
            message: `New ${task.priority} priority task "${task.title}" has been assigned to you`,
            timestamp: this.dateToString(new Date()),
            isRead: false,
            type: 'info',
            relatedTaskId: response.taskId
          }).subscribe();
        } else {
          console.error('Could not find student ID for created task:', response);
        }
      },
      error: (error) => {
        console.error('Error details:', error.error);
      }
    });
  }

  createTask(task: Task) {
    alert("✅ Task created successfully! The student will receive an email & a calendar notification.");
    this.taskService.createTask(
      this.selectedProjectId,
      this.selectedManagerId,
      task
    ).subscribe({
      next: (response) => {
        this.loadTasks();
        this.closeTaskDrawer();
        
        // Get the student ID from the created task
        const studentId = response.student?.id;
        
        if (studentId) {
          // Add notification for the student
          // Example of how to create a notification with proper sender and recipient IDs
          this.notificationService.addNotification({
            id: Date.now(),
            userId: studentId, // The recipient (student)
            //senderId: this.selectedManagerId, // The sender (manager)
            message: `New ${task.priority} priority task "${task.title}" has been assigned to you`,
            timestamp: this.dateToString(new Date()),
            isRead: false,
            type: 'info',
            relatedTaskId: response.taskId
          }).subscribe();
        } else {
          console.error('Could not find student ID for created task:', response);
        }
      },
      error: (error) => {
        console.error('Error creating task:', error);
      }
    });
  }

  updateTask(task: Task) {
    console.log('Updating task:', task);
    this.taskService.updateTaskStatus(
      this.selectedProjectId,
      this.selectedManagerId,
      task.taskId!,
      task.status || 'TO_DO'
    ).subscribe({
      next: (updatedTask) => {
        console.log('Task updated:', updatedTask);
        const index = this.tasks.findIndex(t => t.taskId === updatedTask.taskId);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.loadTasks();
        this.closeTaskDrawer();
        
        // For status updates, send notification to the manager
        // Since this is in the manager component, we're assuming the student changed the status
        // and the manager should be notified
        const managerId = updatedTask.projectManager?.id || this.selectedManagerId;
        
        // Add notification for the manager
        this.notificationService.addNotification({
          id: Date.now(),
          userId: managerId,
          message: `Task "${updatedTask.title}" status has been changed to ${updatedTask.status}`,
          timestamp: this.dateToString(new Date()),
          isRead: false,
          type: 'success',
          relatedTaskId: updatedTask.taskId
        }).subscribe();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
      }
    });
  }

  getEmptyTask(): Task {
    return {
      title: '',
      description: '',
      deadline: new Date(),
      priority: 'Second_Level',
      projectManager: {
        id: this.selectedManagerId
      },
      project: {
        projectId: this.selectedProjectId
      },
      status: 'TO_DO',
      timer: 0
    };
  }

  deleteTask(taskId: number) {
    // First, get the task to find the student ID
    const taskToDelete = this.tasks.find(t => t.taskId === taskId);
    const studentId = taskToDelete?.student?.id;
    
    if (!studentId) {
      console.error('Could not find student ID for task:', taskId);
      return; // Don't proceed if we can't find the student ID
    }
    
    this.taskService.deleteTask(
      this.selectedProjectId, 
      taskId, 
      this.selectedManagerId
    ).subscribe({
      next: () => {
        this.loadTasks(); // Reload after deletion
        
        // Add notification for task deletion
        this.notificationService.addNotification({
          id: Date.now(),
          userId: studentId, // Use the student ID from the task
          //senderId: this.selectedManagerId,  // Add this line
          message: `A task has been removed from your project`,
          timestamp: this.dateToString(new Date()),
          isRead: false,
          type: 'warning'
        }).subscribe();
      },
      error: (error) => console.error('Error deleting task:', error)
    });
  }

  openEditTaskDrawer(task: Task) {
    console.log('Opening edit drawer for task:', task);
    this.newTask = { ...task };
    this.isEditing = true;
    this.isDrawerOpen = true;
  }

  
}
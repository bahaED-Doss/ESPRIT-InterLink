import { Task } from '../../models/task.model';
import { Component, Input, Output, EventEmitter,OnInit, OnChanges, SimpleChanges, Renderer2,OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../Services/task.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnChanges, OnInit, OnDestroy {
  @Input() tasks: Task[] = [];
  @Input() isManager: boolean = false;
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  private refreshSubscription: Subscription | undefined;  // Fixed initialization issue

  constructor(private taskService: TaskService) {}

  // Add this method
  private loadTasks(): void {
    // Since tasks are provided via @Input, we just need to filter them
    this.filterTasks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.filterTasks();
    }
  }

  filterTasks(): void {
    this.todoTasks = this.tasks.filter(task => task.status === 'TO_DO');
    this.inProgressTasks = this.tasks.filter(task => task.status === 'IN_PROGRESS');
    this.doneTasks = this.tasks.filter(task => task.status === 'DONE');
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Get the task being moved
      const task = event.previousContainer.data[event.previousIndex];
      
      // Determine the new status based on the container ID
      let newStatus: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
      switch (event.container.id) {
        case 'todoList':
          newStatus = 'TO_DO';
          break;
        case 'inProgressList':
          newStatus = 'IN_PROGRESS';
          break;
        case 'doneList':
          newStatus = 'DONE';
          break;
        default:
          newStatus = 'TO_DO';
      }
      
      // Only students can change task status via drag and drop
      if (!this.isManager) {
        // Update the task status in the backend
        this.taskService.updateTaskStatus(
          task.project?.projectId || 0,
          task.projectManager?.id || 0,
          task.taskId || 0,
          newStatus
        ).subscribe({
          next: (updatedTask) => {
            console.log('Task status updated:', updatedTask);
            
            // Move the item in the UI
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex
            );
            
            // Update the task status in our local array
            const index = event.container.data.findIndex(t => t.taskId === updatedTask.taskId);
            if (index !== -1) {
              event.container.data[index].status = newStatus;
            }
          },
          error: (error) => {
            console.error('Error updating task status:', error);
          }
        });
      } else {
        // If manager, just move the item visually but don't update status
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }

  onEditTask(task: Task): void {
    this.editTask.emit(task);
  }

  onDeleteTask(taskId: number): void {
    this.deleteTask.emit(taskId);
  }

  trackByTaskId(index: number, task: Task): number {
    return task.taskId || index;
  }

  getPriorityCount(status: string, priority: string): number {
    let tasksInStatus: Task[] = [];
    
    switch (status) {
      case 'TO_DO':
        tasksInStatus = this.todoTasks;
        break;
      case 'IN_PROGRESS':
        tasksInStatus = this.inProgressTasks;
        break;
      case 'DONE':
        tasksInStatus = this.doneTasks;
        break;
      default:
        tasksInStatus = [];
    }
    
    // Map the priority values to match what's in your data
    let priorityValue: string;
    switch (priority) {
      case 'HIGH':
        priorityValue = 'HIGH';
        break;
      case 'MEDIUM':
        priorityValue = 'Second_Level';
        break;
      case 'LOW':
        priorityValue = 'LOW';
        break;
      default:
        priorityValue = '';
    }
    
    return tasksInStatus.filter(task => task.priority === priorityValue).length;
  }

  ngOnInit() {
    // Initial load
    this.loadTasks();
    
    // Set up automatic refresh every 1 second
    this.refreshSubscription = interval(1000).subscribe(() => {
      this.loadTasks();
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
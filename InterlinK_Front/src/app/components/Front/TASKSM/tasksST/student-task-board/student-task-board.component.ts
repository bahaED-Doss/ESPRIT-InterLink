import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Renderer2, OnDestroy } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { Task } from '../../models/task.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

// Define the TaskStatus type
type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';

export interface StatusChangeEvent {
  taskId: number;
  newStatus: string;
  userId: number;
}

@Component({
  selector: 'app-student-task-board',
  templateUrl: './student-task-board.component.html',
  styleUrls: ['./student-task-board.component.css']
})
export class StudentTaskBoardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tasks: Task[] = [];
  @Input() studentId: number = 0;
  @Input() projectId: number = 0;
  @Input() managerId: number = 0;
  @Output() statusChanged = new EventEmitter<StatusChangeEvent>();
  @Output() viewDetails = new EventEmitter<Task>();

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  
  // Add missing properties
  selectedTask: Task | null = null;
  showTaskDetails: boolean = false;
  feedbackTask: Task | null = null;
  showFeedbackPanel: boolean = false;
  
  // For tracking hover effects
  columnHoverPositions: {x: number, y: number}[] = [{x: 50, y: 50}, {x: 50, y: 50}, {x: 50, y: 50}];
  
  // Add properties for real-time updates
  private refreshInterval: Subscription | null = null;
  private taskPollingSubscription: Subscription | null = null;
  refreshRate: number = 30000; // 30 seconds by default
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private taskService: TaskService, 
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('Student Task Board Component initialized');
    console.log('Initial tasks:', this.tasks);
    console.log('Student ID:', this.studentId);
    console.log('Project ID:', this.projectId);
    console.log('Manager ID:', this.managerId);
    this.updateTaskLists();
    
    // Start real-time updates
    this.startRealTimeUpdates();
    
    // Check for query parameters to open specific task/feedback
    this.route.queryParams.subscribe((params: any) => {
      if (params['openTask']) {
        const taskId = +params['openTask'];
        const task = this.tasks.find(t => t.taskId === taskId);
        
        if (task) {
          this.selectedTask = task;
          
          // If openFeedback is true, open the feedback panel
          if (params['openFeedback'] === 'true') {
            this.feedbackTask = task;
            this.showFeedbackPanel = true;
            
            // Mark feedbacks as seen
            this.markFeedbacksAsSeen(task);
          }
        }
      }
    });
    
    // Set up faster task polling (5 seconds instead of 30)
    if (this.studentId) {
      this.setupFastPolling();
    }
  }

  // Add missing method
  startRealTimeUpdates() {
    console.log('Starting real-time updates for student ID:', this.studentId);
    this.setupFastPolling();
  }
  
  // Add missing method
  setupFastPolling() {
    // Clear any existing subscriptions
    if (this.taskPollingSubscription) {
      this.taskPollingSubscription.unsubscribe();
    }
    
    // Set up fast polling (every 5 seconds)
    this.taskPollingSubscription = this.taskService.setupTaskPolling(this.studentId, 5000)
      .subscribe({
        next: (tasks) => {
          console.log(`Received ${tasks.length} tasks from polling`);
          this.tasks = tasks;
          this.loading = false;
          this.error = null;
        },
        error: (err) => {
          console.error('Error polling tasks:', err);
          this.error = 'Failed to load tasks';
          this.loading = false;
        }
      });
  }

  // Make sure to clean up subscriptions
  ngOnDestroy() {
    if (this.taskPollingSubscription) {
      this.taskPollingSubscription.unsubscribe();
    }
    if (this.refreshInterval) {
      console.log('Cleaning up real-time updates subscription');
      this.refreshInterval.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Task board received changes:', changes);
    if (changes['tasks']) {
      console.log('Tasks changed, updating task lists with:', this.tasks);
      this.updateTaskLists();
    }
  }

  updateTaskLists() {
    // Make sure tasks is defined
    if (!this.tasks) {
      console.warn('Tasks array is undefined');
      this.tasks = [];
      return;
    }
    
    console.log('Updating task lists with tasks:', this.tasks);
    console.log('Tasks length:', this.tasks.length);
    
    // Log each task to check its status
    this.tasks.forEach((task, index) => {
      console.log(`Task ${index}:`, task);
      console.log(`  - ID: ${task.taskId}`);
      console.log(`  - Title: ${task.title}`);
      console.log(`  - Status: ${task.status}`);
      console.log(`  - Priority: ${task.priority}`);
      
      // Make sure each task has a valid status
      if (!task.status) {
        console.warn(`Task ${task.taskId} has no status, defaulting to TO_DO`);
        task.status = 'TO_DO';
      }
    });
    
    // Filter tasks by status
    this.todoTasks = this.getTasks('TO_DO');
    this.inProgressTasks = this.getTasks('IN_PROGRESS');
    this.doneTasks = this.getTasks('DONE');
    
    console.log(`Tasks by status - TO_DO: ${this.todoTasks.length}, IN_PROGRESS: ${this.inProgressTasks.length}, DONE: ${this.doneTasks.length}`);
    
    // Log the task lists for debugging
    console.log('TO_DO tasks:', this.todoTasks);
    console.log('IN_PROGRESS tasks:', this.inProgressTasks);
    console.log('DONE tasks:', this.doneTasks);
  }

  getTasks(status: string): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  getPriorityCount(status: string, priority: string): number {
    return this.getTasks(status).filter(task => 
      task.priority && task.priority.toUpperCase() === priority.toUpperCase()
    ).length;
  }

  drop(event: CdkDragDrop<Task[]>) {
    console.log('Drop event:', event);
    console.log('Previous container data:', event.previousContainer.data);
    console.log('Previous index:', event.previousIndex);
    
    // Check if we're moving between different lists
    if (event.previousContainer !== event.container) {
      // Get the task that was moved
      if (event.previousIndex < 0 || event.previousIndex >= event.previousContainer.data.length) {
        console.error('Invalid previous index:', event.previousIndex);
        return;
      }
      
      const task = event.previousContainer.data[event.previousIndex];
      
      // Make sure task is defined before accessing its properties
      if (!task) {
        console.error('Task is undefined in drop event');
        return;
      }
      
      // Get the new status based on the container id
      const newStatus = event.container.id as TaskStatus;
      
      console.log(`Moving task ${task.title} from ${task.status} to ${newStatus}`);
      
      // Update the task status in the backend
      this.taskService.updateTaskStatus(
        this.projectId,
        this.managerId,
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
          
          // Update the task's status in our local data
          const movedTask = event.container.data[event.currentIndex];
          if (movedTask) {
            movedTask.status = newStatus;
          }
        },
        error: (error) => {
          console.error('Error updating task status:', error);
        }
      });
    } else {
      // If we're just reordering within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  // Fixed method for viewing task details
  onViewDetails(task: Task): void {
    this.selectedTask = task;
    this.showTaskDetails = true;
    document.body.style.overflow = 'hidden';
    this.viewDetails.emit(task);
    
    // Remove the feedback marking code from here
    // We only want to mark feedbacks as seen when clicking on the feedback button
  }
  
  // Fixed method to close task details
  closeTaskDetails(): void {
    this.selectedTask = null;
    this.showTaskDetails = false;
    document.body.style.overflow = '';
  }

  // Add method to mark feedbacks as seen
  markFeedbacksAsSeen(task: Task): void {
    // Check if there are any unseen feedbacks
    const unseenFeedbacks = task.feedbacks?.filter(feedback => !feedback.seen);
    
    if (unseenFeedbacks && unseenFeedbacks.length > 0) {
      console.log(`Marking ${unseenFeedbacks.length} feedbacks as seen`);
      
      // Update locally first for immediate UI feedback
      unseenFeedbacks.forEach(feedback => {
        feedback.seen = true;
        
        // Then update in the backend for each feedback
        if (feedback.feedbackId) {
          this.taskService.markFeedbackAsSeen(feedback.feedbackId).subscribe({
            next: (updatedFeedback: any) => {
              console.log('Feedback marked as seen:', updatedFeedback);
            },
            error: (error: any) => {
              console.error(`Error marking feedback ${feedback.feedbackId} as seen:`, error);
              // Revert the local change if the API call fails
              feedback.seen = false;
            }
          });
        }
      });
    }
  }

  trackByTaskId(index: number, task: Task): number {
    return task.taskId || index;
  }

  getStatusFromId(id: string): string {
    switch (id) {
      case 'todoList': return 'TO_DO';
      case 'inProgressList': return 'IN_PROGRESS';
      case 'doneList': return 'DONE';
      default: return 'TO_DO';
    }
  }

  // Methods for handling hover effects
  onColumnHeaderMouseMove(event: MouseEvent, index: number): void {
    if (this.showTaskDetails) return; // Ignore hover effect when modal is open
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.columnHoverPositions[index] = { x, y };
  }

  onColumnHeaderMouseLeave(index: number): void {
    if (this.showTaskDetails) return;
    this.columnHoverPositions[index] = { x: 0, y: 0 };
  }
  
  // Method to handle feedback click
  onFeedbackClick(task: Task | null): void {
    if (!task) {
      this.showFeedbackPanel = false;
      this.feedbackTask = null;
      return;
    }
    
    this.feedbackTask = task;
    this.showFeedbackPanel = true;
    
    // Keep the feedback marking code here
    if (task.feedbacks && task.feedbacks.length > 0) {
      this.markFeedbacksAsSeen(task);
    }
  }
  
  // Method to close feedback panel
  closeFeedbackPanel(): void {
    this.showFeedbackPanel = false;
    this.feedbackTask = null;
  }
}

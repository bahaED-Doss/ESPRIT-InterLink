import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { Task } from '../../models/task.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
export class StudentTaskBoardComponent implements OnInit, OnChanges {
  @Input() tasks: Task[] = [];
  @Input() studentId: number = 0;
  @Input() projectId: number = 0;
  @Output() statusChanged = new EventEmitter<StatusChangeEvent>();
  @Output() viewDetails = new EventEmitter<Task>();

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  
  // For tracking hover effects
  columnHoverPositions: {x: number, y: number}[] = [{x: 50, y: 50}, {x: 50, y: 50}, {x: 50, y: 50}];

  constructor(private taskService: TaskService, private renderer: Renderer2) {}

  ngOnInit() {
    console.log('Student Task Board Component initialized');
    console.log('Initial tasks:', this.tasks);
    this.updateTaskLists();
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
    
    if (event.previousContainer === event.container) {
      console.log('Reordering within the same container');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('Moving between containers');
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = this.getStatusFromId(event.container.id);
      
      console.log(`Moving task ${task.taskId} from ${task.status} to ${newStatus}`);
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (task.taskId) {
        // Update the task status in the UI immediately
        task.status = newStatus as 'TO_DO' | 'IN_PROGRESS' | 'DONE';
        
        // Emit event to parent component to update the backend
        this.statusChanged.emit({ 
          taskId: task.taskId, 
          newStatus: newStatus, 
          userId: this.studentId 
        });
      } else {
        console.error('Task has no ID, cannot update status');
      }
    }
  }

  onViewDetails(task: Task) {
    console.log('Viewing task details:', task);
    this.viewDetails.emit(task);
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
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.columnHoverPositions[index] = { x, y };
  }
}
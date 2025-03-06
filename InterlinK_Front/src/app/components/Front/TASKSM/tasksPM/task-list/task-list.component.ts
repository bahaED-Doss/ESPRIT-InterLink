import { Task } from '../../models/task.model';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  @Input() isManager: boolean = false;
  @Output() statusChanged = new EventEmitter<{task: Task, newStatus: string}>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks']) {
      this.filterTasks();
    }
  }

  filterTasks() {
    // Make sure tasks is defined before filtering
    if (!this.tasks) {
      this.todoTasks = [];
      this.inProgressTasks = [];
      this.doneTasks = [];
      return;
    }

    this.todoTasks = this.getTasks('TO_DO');
    this.inProgressTasks = this.getTasks('IN_PROGRESS');
    this.doneTasks = this.getTasks('DONE');
  }

  getTasks(status: string): Task[] {
    if (!this.tasks) return [];
    return this.tasks.filter(task => task && task.status === status);
  }

  getPriorityCount(status: string, priority: string): number {
    const tasks = this.getTasks(status);
    if (!tasks || tasks.length === 0) return 0;
    
    return tasks.filter(task => 
      task && task.priority && task.priority.toUpperCase() === priority.toUpperCase()
    ).length;
  }

  trackByTaskId(index: number, task: Task): number {
    return task.taskId || index; // Use index as fallback if taskId is undefined
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      if (!task) return;
      
      const newStatus = this.getStatusFromId(event.container.id);
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Emit the status change
      this.statusChanged.emit({
        task: task,
        newStatus: newStatus
      });
    }
  }

  getStatusFromId(id: string): string {
    switch (id) {
      case 'todoList': return 'TO_DO';
      case 'inProgressList': return 'IN_PROGRESS';
      case 'doneList': return 'DONE';
      default: return 'TO_DO';
    }
  }

  onEditTask(task: Task) {
    this.editTask.emit(task);
  }

  onDeleteTask(taskId: number) {
    this.deleteTask.emit(taskId);
  }
}
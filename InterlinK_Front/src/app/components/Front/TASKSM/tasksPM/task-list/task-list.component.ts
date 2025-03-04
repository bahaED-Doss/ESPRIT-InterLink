
import { Task } from '../../models/task.model';
import { Component, Input, Output, EventEmitter, OnChanges,HostListener } from '@angular/core';
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

  constructor() {}

  ngOnChanges() {
    this.filterTasks();
  }

  filterTasks() {
    // Optional: Implement if needed for filtering
  }


  getTasks(status: string): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  getPriorityCount(status: string, priority: string): number {
    return this.getTasks(status).filter(task => 
      task.priority.toUpperCase() === priority.toUpperCase()
    ).length;
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = this.getStatusFromId(event.container.id);
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.statusChanged.emit({ task, newStatus });
    }
  }

   onEditTask(task: Task) {
    this.editTask.emit(task);
  }

  onDeleteTask(taskId: number) {
    this.deleteTask.emit(taskId);
  }

  trackByTaskId(index: number, task: Task): number {
    return task.taskId || index;
  }

  private getStatusFromId(id: string): string {
    switch(id) {
      case 'todoList': return 'TO_DO';
      case 'inProgressList': return 'IN_PROGRESS';
      case 'doneList': return 'DONE';
      default: return 'TO_DO';
    }
  }
}
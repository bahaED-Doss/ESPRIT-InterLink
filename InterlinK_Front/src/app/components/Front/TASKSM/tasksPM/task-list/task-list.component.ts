import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  getTasks(status: string): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  trackByTaskId(index: number, task: Task): number {
    return task.taskId || index;
  }

  onEditTask(task: Task) {
    this.editTask.emit(task);
    this.getTasks('TO_DO');
  }

  onDeleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.deleteTask.emit(taskId);
      this.getTasks('TO_DO');
    }
  }

  toggleDropdown(event: Event, task: Task) {
    event.stopPropagation();
    task.showDropdown = !task.showDropdown;
    this.tasks.forEach(t => {
      if (t !== task) t.showDropdown = false;
    });
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.tasks.forEach(task => task.showDropdown = false);
    this.getTasks('TO_DO');
  }
}
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() userRole!: string; // Add this line
  @Output() flag = new EventEmitter();
  @Output() details = new EventEmitter();
  @Output() statusChange = new EventEmitter<{task: Task, newStatus: string}>(); // Add this for status changes
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Input() isManager = false;

  isMenuOpen = false;

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.menu-container')) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onDetails(): void {
    this.details.emit(this.task);
    this.isMenuOpen = false;
  }

  onFlag(): void {
    this.flag.emit(this.task);
    this.isMenuOpen = false;
  }

  onDelete() {
    if (this.task.taskId) {
      this.delete.emit(this.task.taskId);
    }
  }

  onEdit(): void {
    console.log('Editing task:', this.task);
    this.edit.emit(this.task);
    this.isMenuOpen = false;
  }

  onStatusChange(newStatus: string): void {
    this.statusChange.emit({task: this.task, newStatus: newStatus});
  }

  showEditOptions(): boolean {
    return this.isManager;
  }

  showStatusChangeOptions(): boolean {
    // Allow both manager and student to drag-drop
    return true;
  }
}
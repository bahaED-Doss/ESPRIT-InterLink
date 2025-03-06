import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-student-task-card',
  templateUrl: './student-task-card.component.html',
  styleUrls: ['./student-task-card.component.css']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() viewDetails = new EventEmitter<Task>();

  isMenuOpen = false;
  showDetails = false;

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-button') && !target.closest('.dropdown-menu') && !target.closest('.modal-content')) {
      this.isMenuOpen = false;
      if (!target.closest('.modal')) {
        this.showDetails = false;
      }
    }
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onViewDetails(): void {
    this.showDetails = true;
    this.isMenuOpen = false;
    this.viewDetails.emit(this.task);
  }

  closeDetails(): void {
    this.showDetails = false;
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'secondary';
    
    switch (status) {
      case 'TO_DO': return 'secondary';
      case 'IN_PROGRESS': return 'warning';
      case 'DONE': return 'success';
      default: return 'secondary';
    }
  }

  getPriorityClass(priority: string | undefined): string {
    if (!priority) return 'secondary';
    
    switch (priority.toUpperCase()) {
      case 'HIGH': return 'danger';
      case 'SECOND_LEVEL': return 'warning';
      case 'LOW': return 'success';
      default: return 'secondary';
    }
  }
}

import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../Services/task.service';

@Component({
  selector: 'app-student-task-card',
  templateUrl: './student-task-card.component.html',
  styleUrls: ['./student-task-card.component.css']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() viewDetails = new EventEmitter<Task>();
  @Output() feedbackClick = new EventEmitter<Task | null>();

  isMenuOpen = false;
  // Remove this property as we don't need it anymore
  // showDetails = false;
  showFeedbacks = false;

  constructor(private taskService: TaskService) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    
    // Only close menu if clicking outside menu and not on menu button
    if (!target.closest('.dropdown-menu') && !target.closest('.action-button')) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onDetails(event?: Event): void {
    if (event) event.stopPropagation();
    // Just emit the event to parent, don't try to show details locally
    this.viewDetails.emit(this.task);
    this.isMenuOpen = false;
  }

  // Remove this method as we don't need it anymore
  // closeDetails(): void {
  //   this.showDetails = false;
  // }

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

  onFeedbackClick(event: Event): void {
    event.stopPropagation();
    this.showFeedbacks = !this.showFeedbacks; // Toggle feedback panel
    
    if (this.showFeedbacks) {
      this.feedbackClick.emit(this.task);
      
      // Mark manager feedbacks as seen when student views them
      if (this.task.feedbacks && this.task.feedbacks.length > 0) {
        this.markManagerFeedbacksAsSeen();
      }
    } else {
      this.feedbackClick.emit(null);
    }
  }
  
  markManagerFeedbacksAsSeen(): void {
    // Filter for manager feedbacks that aren't seen yet
    const unseenManagerFeedbacks = this.task.feedbacks?.filter(
      feedback => feedback.givinBy === 'Manager' && !feedback.seen
    );
    
    if (unseenManagerFeedbacks && unseenManagerFeedbacks.length > 0) {
      console.log(`Marking ${unseenManagerFeedbacks.length} manager feedbacks as seen`);
      
      // Update locally first for immediate UI feedback
      unseenManagerFeedbacks.forEach(feedback => {
        feedback.seen = true;
        
        // Then update in the backend
        if (feedback.feedbackId) {
          this.taskService.markFeedbackAsSeen(feedback.feedbackId).subscribe({
            next: () => {
              console.log(`Feedback ${feedback.feedbackId} marked as seen`);
            },
            error: (error) => {
              console.error(`Error marking feedback ${feedback.feedbackId} as seen:`, error);
              // Revert the local change if the API call fails
              feedback.seen = false;
            }
          });
        }
      });
    }
  }
  
  closeFeedbacks(): void {
    this.showFeedbacks = false;
    this.feedbackClick.emit(null);
  }
  
  getSentimentClass(sentiment: string | undefined): string {
    if (!sentiment) return '';
    
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'positive-feedback';
      case 'negative': return 'negative-feedback';
      case 'neutral': return 'neutral-feedback';
      default: return '';
    }
  }
}

import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Task } from '../../models/task.model';
import { Feedback } from '../../models/feedback.model';
import { FeedbackService } from '../../Services/feedback.service';
import { TaskService } from '../../Services/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() userRole: string = 'student'; // Default to student view
  @Input() isManager: boolean = false;   // For backward compatibility
  
  // Outputs for both views
  @Output() viewDetails = new EventEmitter<Task>();
  @Output() feedbackClick = new EventEmitter<Task | null>();
  
  // Manager-specific outputs
  @Output() statusChange = new EventEmitter<{task: Task, newStatus: string}>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  // Add these properties for the feedback form
  newFeedbackMessage: string = '';
  newFeedbackSentiment: string = 'NEUTRAL';

  isMenuOpen = false;
  showDeleteConfirm = false;
  showDetails = false;
  showFeedbacks: boolean = false;

  constructor(
    private feedbackService: FeedbackService,
    private taskService: TaskService
  ) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-button') && !target.closest('.dropdown-menu') && !target.closest('.modal-content')) {
      this.isMenuOpen = false;
      if (!target.closest('.modal')) {
        this.showDeleteConfirm = false;
        this.showDetails = false;
      }
    }
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onDetails(event?: Event): void {
    if (event) event.stopPropagation();
    
    if (this.isStudentView()) {
      // Student view - emit event to parent
      this.viewDetails.emit(this.task);
      this.isMenuOpen = false;
    } else {
      // Manager view - show details locally
      this.showDetails = true;
      this.isMenuOpen = false;
    }
  }

  closeDetails(): void {
    this.showDetails = false;
  }

  onEdit(): void {
    this.edit.emit(this.task);
    this.isMenuOpen = false;
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
    this.isMenuOpen = false;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  onDelete(): void {
    this.delete.emit(this.task.taskId);
    this.showDeleteConfirm = false;
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
      case 'MEDIUM': 
      case 'SECOND_LEVEL': return 'warning';
      case 'LOW': return 'success';
      default: return 'secondary';
    }
  }

  onFeedbackClick(event: Event): void {
    event.stopPropagation();
    this.showFeedbacks = !this.showFeedbacks;
    
    if (this.isStudentView()) {
      // Student-specific behavior
      if (this.showFeedbacks) {
        this.feedbackClick.emit(this.task);
        
        // Mark manager feedbacks as seen when student views them
        if (this.task.feedbacks && this.task.feedbacks.length > 0) {
          this.markManagerFeedbacksAsSeen();
        }
      } else {
        this.feedbackClick.emit(null);
      }
    } else {
      // Manager-specific behavior
      this.isMenuOpen = false;
    }
  }

  // Student-specific method
  markManagerFeedbacksAsSeen(): void {
    // Only run this for student view
    if (!this.isStudentView()) return;
    
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

  // Manager-specific method
  addFeedback(): void {
    if (!this.newFeedbackMessage || !this.task.taskId) return;

    const newFeedback: Feedback = {
      message: this.newFeedbackMessage,
      sentiment: this.newFeedbackSentiment as any,
      givinBy: 'Manager', // You might want to get the actual user name
      taskId: this.task.taskId,
      seen: false // Initialize as not seen when creating a new feedback
    };

    // Assuming you have userId available, otherwise you'll need to get it
    const userId = 1; // Replace with actual user ID

    this.feedbackService.addFeedback(this.task.taskId, userId, newFeedback).subscribe(
      feedback => {
        // If task.feedbacks doesn't exist, initialize it
        if (!this.task.feedbacks) {
          this.task.feedbacks = [];
        }
        this.task.feedbacks.push(feedback);
        
        // Reset form
        this.newFeedbackMessage = '';
        this.newFeedbackSentiment = 'NEUTRAL';
      },
      error => {
        console.error('Error adding feedback:', error);
      }
    );
  }

  // Manager-specific method
  deleteFeedback(feedbackId: number | undefined): void {
    if (!feedbackId) return;

    this.feedbackService.deleteFeedback(feedbackId).subscribe(
      () => {
        // Remove the feedback from the task's feedbacks array
        if (this.task.feedbacks) {
          this.task.feedbacks = this.task.feedbacks.filter(f => f.feedbackId !== feedbackId);
        }
      },
      error => {
        console.error('Error deleting feedback:', error);
      }
    );
  }

  // Helper method to determine if we're in student view
  isStudentView(): boolean {
    return this.userRole === 'student' && !this.isManager;
  }

  // Helper method to determine if the current user can delete a feedback
  canDeleteFeedback(feedback: any): boolean {
    // If the user is a manager, they can delete any feedback
    if (this.isManager) {
      return true;
    }
    
    // If the feedback was given by the current user, they can delete their own feedback
    return feedback.givinBy === 'Manager'; // Adjust this condition as needed
  }
  
  getSentimentClass(sentiment: string): string {
    if (!sentiment) return 'neutral';
    
    switch (sentiment.toUpperCase()) {
      case 'POSITIVE': return 'positive';
      case 'NEGATIVE': return 'negative';
      default: return 'neutral';
    }
  }
}
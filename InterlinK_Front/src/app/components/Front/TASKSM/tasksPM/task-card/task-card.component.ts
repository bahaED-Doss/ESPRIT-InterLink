import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Task } from '../../models/task.model';
import { Feedback } from '../../models/feedback.model';
import { FeedbackService } from '../../Services/feedback.service';
import { TaskService } from '../../Services/task.service';
import { Sentiment } from '../../models/feedback.model';  // Add this import

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

  markManagerFeedbacksAsSeen(): void {
    if (!this.isStudentView()) return;
    
    const unseenFeedbacks = this.task.feedbacks?.filter(f => !f.seen);
    
    unseenFeedbacks?.forEach(feedback => {
      if (feedback.feedbackId) {
        this.feedbackService.markFeedbackAsSeen(feedback.feedbackId).subscribe({
          next: (updatedFeedback) => {
            // Update the feedback in the task's feedback array
            const index = this.task.feedbacks?.findIndex(f => f.feedbackId === feedback.feedbackId);
            if (index !== undefined && index !== -1 && this.task.feedbacks) {
              this.task.feedbacks[index] = updatedFeedback;
            }
          },
          error: (error) => {
            console.error('Error marking feedback as seen:', error);
          }
        });
      }
    });
  }
  
  // Manager-specific method
  

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
  
  // Add these properties for hint functionality
  activeHintId: number | null = null;
  showHintContent = false;

  // Add these methods for hint functionality
  showHintTooltip(feedback: Feedback) {
    if (feedback.feedbackId) {
      this.activeHintId = feedback.feedbackId;
      this.showHintContent = false;
    }
  }

  hideHintTooltip() {
    setTimeout(() => {
      if (!document.querySelector('.hint-tooltip:hover')) {
        this.activeHintId = null;
        this.showHintContent = false;
      }
    }, 100);
  }

  toggleHintContent(feedback: Feedback) {
    if (feedback.hint && feedback.feedbackId === this.activeHintId) {
      this.showHintContent = !this.showHintContent;
    }
  }

  // Update addFeedback method
  addFeedback(): void {
    if (!this.newFeedbackMessage?.trim() || !this.task.taskId) return;
  
    const newFeedback: Feedback = {
      message: this.newFeedbackMessage.trim(),
      givinBy: 'Manager',
      taskId: this.task.taskId,
      seen: false,
      sentiment: this.newFeedbackSentiment as any  // Use the form sentiment value
    };
  
    const managerId = 1;
  
    this.feedbackService.addFeedback(this.task.taskId, managerId, newFeedback).subscribe({
      next: (feedback) => {
        if (!this.task.feedbacks) {
          this.task.feedbacks = [];
        }
        this.task.feedbacks.push(feedback);
        this.newFeedbackMessage = '';
        this.newFeedbackSentiment = 'NEUTRAL';  // Reset sentiment after submission
      },
      error: (error) => console.error('Error adding feedback:', error)
    });
  }

  // Add these methods
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

  closeDetails(): void {
    this.showDetails = false;
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'secondary';
    
    switch (status.toUpperCase()) {
      case 'TO_DO': return 'secondary';
      case 'IN_PROGRESS': return 'warning';
      case 'DONE': return 'success';
      default: return 'secondary';
    }
  }

  // Fix method names to match template usage
  onFeedbackClick(event: Event): void {
    event.stopPropagation();
    this.showFeedbacks = !this.showFeedbacks;
    
    if (this.isStudentView()) {
      // Only emit the event, let parent handle the feedback marking
      this.feedbackClick.emit(this.showFeedbacks ? this.task : null);
      this.markManagerFeedbacksAsSeen
    } else {
      this.isMenuOpen = false;
    }
  }

  onDetails(event?: Event): void {
    if (event) event.stopPropagation();
    
    if (this.isStudentView()) {
      // Only emit the event, let parent handle the feedback marking
      this.viewDetails.emit(this.task);
      this.isMenuOpen = false;
      this.markManagerFeedbacksAsSeen();
    } else {
      this.showDetails = true;
      this.isMenuOpen = false;
    }
  }

  markFeedbacksAsSeen(): void {
    if (!this.isStudentView() || !this.task.feedbacks) return;
    
    const unseenFeedbacks = this.task.feedbacks.filter(
      feedback => !feedback.seen && feedback.givinBy === 'Manager'
    );
    
    if (unseenFeedbacks.length > 0) {
      console.log('Marking feedbacks as seen:', unseenFeedbacks);
      
      unseenFeedbacks.forEach(feedback => {
        // Update locally first for immediate UI feedback
        feedback.seen = true;
        
        if (feedback.feedbackId) {
          this.feedbackService.markFeedbackAsSeen(feedback.feedbackId).subscribe({
            next: (updatedFeedback) => {
              console.log('Feedback marked as seen:', updatedFeedback);
              // Update the feedback in the array
              const index = this.task.feedbacks?.findIndex(f => f.feedbackId === feedback.feedbackId);
              if (index !== undefined && index !== -1 && this.task.feedbacks) {
                this.task.feedbacks[index] = {
                  ...this.task.feedbacks[index],
                  seen: true
                };
              }
            },
            error: (error) => {
              console.error('Error marking feedback as seen:', error);
              // Revert the local change if the API call fails
              feedback.seen = false;
            }
          });
        }
      });
    }
  }
}
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Feedback, Sentiment } from '../models/feedback.model';
import { TaskService } from '../Services/task.service';
import { FeedbackService } from '../Services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  // Add this if using standalone components
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class FeedbackComponent implements OnInit {
  @Input() taskId!: number;
  @Input() userId!: number;
  @Input() userName!: string;
  @Input() isManager: boolean = false;
  @Output() feedbackAdded = new EventEmitter<Feedback>();
  
  feedbacks: Feedback[] = [];
  feedbackForm: FormGroup;
  showFeedbackForm: boolean = false;
  sentimentOptions = Object.values(Sentiment);
  isAnalyzingSentiment: boolean = false;
  
  constructor(
    private feedbackService: FeedbackService,
    private fb: FormBuilder
  ) {
    this.feedbackForm = this.fb.group({
      message: ['', Validators.required],
      sentiment: [Sentiment.NEUTRAL, Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.loadFeedbacks();
  }
  
  // Update all service method calls
  loadFeedbacks(): void {
    this.feedbackService.getFeedbacksForTask(this.taskId).subscribe(
      feedbacks => {
        this.feedbacks = feedbacks;
      }
    );
  }
  
  submitFeedback(): void {
    if (this.feedbackForm.valid) {
      const newFeedback: Feedback = {
        message: this.feedbackForm.value.message,
        sentiment: this.feedbackForm.value.sentiment,
        givinBy: this.userName,
        taskId: this.taskId,
        createdAt: new Date(),
        seen: false // Add the seen property and initialize it to false
      };
      
      this.feedbackService.addFeedback(this.taskId, this.userId, newFeedback).subscribe(
        feedback => {
          this.feedbacks.push(feedback);
          this.feedbackAdded.emit(feedback);
          this.toggleFeedbackForm();
        }
      );
    }
  }
  
  deleteFeedback(feedbackId: number): void {
    if (!this.isManager) return;
    
    this.feedbackService.deleteFeedback(feedbackId).subscribe(
      () => {
        this.feedbacks = this.feedbacks.filter(f => f.feedbackId !== feedbackId);
      }
    );
  }
  
  toggleFeedbackForm(): void {
    this.showFeedbackForm = !this.showFeedbackForm;
    if (this.showFeedbackForm) {
      this.feedbackForm.reset({
        message: '',
        sentiment: Sentiment.NEUTRAL
      });
    }
  }
  
  // This method will be used later for sentiment analysis
  analyzeSentiment(message: string): void {
    // For now, we'll just set a default sentiment
    // Later, this will call the sentiment analysis API
    this.isAnalyzingSentiment = true;
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Default to NEUTRAL for now
      this.feedbackForm.patchValue({ sentiment: Sentiment.NEUTRAL });
      this.isAnalyzingSentiment = false;
    }, 500);
  }
  
  // Update message and trigger sentiment analysis
  // Update the onMessageChange method
  onMessageChange(): void {
    const message = this.feedbackForm.get('message')?.value;
    if (message && message.length > 10) {
      // This is where we'll call the sentiment analysis API in the future
      // For now, we'll just use manual selection
      console.log('Message changed, will analyze sentiment in the future:', message);
      
      // Uncomment this when ready to implement sentiment analysis
      // this.analyzeSentiment(message);
    }
  }
  
  getSentimentClass(sentiment: Sentiment): string {
    switch (sentiment) {
      case Sentiment.POSITIVE:
        return 'positive';
      case Sentiment.NEGATIVE:
        return 'negative';
      default:
        return 'neutral';
    }
  }
  
  
}
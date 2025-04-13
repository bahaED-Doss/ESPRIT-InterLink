import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of ,throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Feedback } from '../models/feedback.model';
import { TaskService, TaskNotification } from './task.service'; // Import TaskService and TaskNotification

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = 'http://localhost:8085/Interlink/api';

  constructor(
    private http: HttpClient,
    private taskService: TaskService // Add TaskService dependency
  ) { }

  // Get feedbacks for a task
  getFeedbacksForTask(taskId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}/tasks/${taskId}/feedbacks`).pipe(
      tap(feedbacks => console.log(`Fetched ${feedbacks.length} feedbacks for task ${taskId}`)),
      catchError(error => {
        console.error('Error fetching feedbacks:', error);
        return throwError(() => error);
      })
    );
  }

  // Add feedback to a task
  addFeedback(taskId: number, userId: number, feedback: Feedback): Observable<Feedback> {
    const url = `${this.baseUrl}/tasks/${taskId}/feedbacks/${userId}`;
    
    // Create a DTO object to match the backend expectation
    const feedbackDTO = {
      message: feedback.message,
      sentiment: feedback.sentiment,
      givinBy: feedback.givinBy,
      seen: feedback.seen
    };
    
    return this.http.post<Feedback>(url, feedbackDTO).pipe(
      tap((createdFeedback: Feedback) => {
        console.log('Feedback created:', createdFeedback);
        
        // Create notification for the student when manager adds feedback
        if (feedback.givinBy === 'Manager') {
          // Get the task to find the associated student
          this.taskService.getTaskById(0, taskId).subscribe((task: any) => {
            if (task && task.student && task.student.id) {
              // Create notification for the student
              const notification: TaskNotification = {
                id: Date.now(),
                type: 'FEEDBACK_ADDED',
                taskId: taskId,
                message: `New feedback on task "${task.title}"`,
                timestamp: new Date().toISOString(), // Convert Date to ISO string
                isRead: false,
                userId: task.student.id,
                senderId: userId,
                feedbackId: createdFeedback.feedbackId
              };
              
              // Use the addNotification method
              this.taskService.addNotification(notification);
            }
          });
        }
      }),
      catchError(error => {
        console.error('Error creating feedback:', error);
        return throwError(() => error);
      })
    );
  }

  // Update feedback
  updateFeedback(feedbackId: number, feedback: Feedback): Observable<Feedback> {
    const url = `${this.baseUrl}/feedbacks/${feedbackId}`;
    
    return this.http.put<Feedback>(url, feedback).pipe(
      tap(updatedFeedback => {
        console.log('Feedback updated:', updatedFeedback);
      }),
      catchError(error => {
        console.error('Error updating feedback:', error);
        return throwError(() => error);
      })
    );
  }

  // Delete feedback
  deleteFeedback(feedbackId: number): Observable<void> {
    const url = `${this.baseUrl}/feedbacks/${feedbackId}`;
    
    return this.http.delete<void>(url).pipe(
      tap(() => {
        console.log(`Feedback ${feedbackId} deleted`);
      }),
      catchError(error => {
        console.error('Error deleting feedback:', error);
        return throwError(() => error);
      })
    );
  }

  // Add this method to mark a feedback as seen
  markFeedbackAsSeen(feedbackId: number): Observable<Feedback> {
    const url = `${this.baseUrl}/feedbacks/${feedbackId}/seen`;
    
    return this.http.patch<Feedback>(url, {}).pipe(
      tap(updatedFeedback => {
        console.log('Feedback marked as seen:', updatedFeedback);
      }),
      catchError(error => {
        console.error('Error marking feedback as seen:', error);
        return throwError(() => error);
      })
    );
  }

  // Get seen status for feedbacks in a task
  getFeedbackSeenStatus(taskId: number): Observable<{feedbackId: number, seen: boolean}[]> {
    const url = `${this.baseUrl}/tasks/${taskId}/feedbacks/seen-status`;
    
    return this.http.get<{feedbackId: number, seen: boolean}[]>(url).pipe(
      tap(statuses => {
        console.log(`Fetched seen status for feedbacks in task ${taskId}:`, statuses);
      }),
      catchError(error => {
        console.error('Error fetching feedback seen status:', error);
        return throwError(() => error);
      })
    );
  }
}
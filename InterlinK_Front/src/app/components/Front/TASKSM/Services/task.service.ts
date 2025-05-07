import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, timer, Subject, BehaviorSubject } from 'rxjs';
import { catchError, tap, map, switchMap, shareReplay } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { Notification } from '../models/notification.model';

// Define TaskNotification interface here and export it
export interface TaskNotification {
  id: number;
  type: string;
  taskId: number;
  taskTitle?: string; // Add taskTitle as optional property
  message: string;
  timestamp: string; // Keep as string for JSON serialization
  isRead: boolean;
  userId: number;
  senderId: number;
  feedbackId?: number; 
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8085/Interlink/api';
  
  // Add proper typing for subjects
  private taskUpdatesSubject = new Subject<Task[]>();
  public taskUpdates$ = this.taskUpdatesSubject.asObservable();
  private dateToString(date: Date): string {
  return date.toISOString();
}
  private notificationsSubject = new BehaviorSubject<TaskNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable().pipe(
      shareReplay(1) // Cache the latest result
  );

  constructor(private http: HttpClient) {
    // Initialize WebSocket connection for real-time updates
    this.initializeWebSocketConnection();
  }

  // Initialize WebSocket connection
  private initializeWebSocketConnection() {
    // This is a placeholder - you'll need to implement actual WebSocket logic
    // using libraries like socket.io-client or SockJS with STOMP
    console.log('WebSocket connection should be initialized here');
    
    // Example of how you might handle incoming WebSocket messages
    // this.socket.on('taskUpdated', (updatedTask: Task) => {
    //   this.refreshTasksForProject(updatedTask.project?.projectId || 0);
    // });
    
    // this.socket.on('notification', (notification: TaskNotification) => {
    //   const currentNotifications = this.notificationsSubject.value;
    //   this.notificationsSubject.next([...currentNotifications, notification]);
    // });
  }

  // Get all tasks for a project
  getTasksByProjectId(projectId: number): Observable<Task[]> {
    console.log(`Fetching tasks for project ${projectId}`);
    return this.http.get<Task[]>(`${this.baseUrl}/projects/${projectId}/tasks`).pipe(
      tap(tasks => {
        // Update the tasks subject when new data is fetched
        this.taskUpdatesSubject.next(tasks);
      }),
      shareReplay(1) // Cache the latest result
    );
  }

  // Refresh tasks for a project (can be called after changes)
  refreshTasksForProject(projectId: number): void {
    this.getTasksByProjectId(projectId).subscribe();
  }

  // Get tasks for a student
  getTasksByStudentId(studentId: number): Observable<Task[]> {
    console.log(`Fetching tasks for student ${studentId}`);
    const url = `${this.baseUrl}/students/${studentId}/tasks`;
    console.log(`Request URL: ${url}`);
    return this.http.get<Task[]>(url).pipe(
      tap(tasks => {
        console.log('Student tasks loaded:', tasks);
        console.log('Number of tasks:', tasks.length);
        if (tasks.length > 0) {
          console.log('Sample task:', tasks[0]);
        }
        // Update the tasks subject
        this.taskUpdatesSubject.next(tasks);
      }),
      catchError(error => {
        console.error('Error loading student tasks:', error);
        return throwError(() => error);
      })
    );
  }

  // Get student analytics
  getStudentAnalytics(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/students/${studentId}/analytics`).pipe(
      catchError(error => {
        console.error('Error loading student analytics:', error);
        return throwError(() => error);
      })
    );
  }

  // Create a new task
  // In the createTask method
  createTask(projectId: number, managerId: number, task: Task): Observable<Task> {
    const url = `${this.baseUrl}/projects/${projectId}/tasks/${managerId}`;
    
    const payload = {
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: 'High',
      projectManager: { id: managerId },
      project: { projectId: projectId }
    };
  
    console.log('Request payload:', payload);
    return this.http.post<Task>(url, payload).pipe(
      tap(createdTask => {
        console.log('Task created:', createdTask);
        
        // Show success message to the manager (creator)
        this.showTemporaryNotification(`Task "${createdTask.title}" created successfully`);
        
        // Create notification for students in this project
        // We need to get the students assigned to this project
        this.getStudentsForProject(projectId).subscribe(students => {
          students.forEach(student => {
            this.createNotification({
              id: Date.now(),
              type: 'TASK_CREATED',
              taskId: createdTask.taskId || 0,
              taskTitle: createdTask.title,
              message: `New task "${createdTask.title}" has been assigned to your project`,
              timestamp: this.dateToString(new Date()),
              isRead: false,
              userId: student.id,
              senderId: managerId
            });
          });
        });
        
        // Refresh tasks list
        this.refreshTasksForProject(projectId);
      }),
      catchError(error => {
        console.error('Error creating task:', error);
        return throwError(() => error);
      })
    );
  }

  // Get a specific task
  getTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/projects/${projectId}/tasks`);
  }

  // Update task status
  updateTaskStatus(projectId: number, managerId: number, taskId: number, newStatus: string): Observable<any> {
    return this.getTaskById(projectId, taskId).pipe(
      switchMap(task => {
        const studentId = task.student?.id || managerId;
        console.log('Using student ID for task status update:', studentId);
        
        const url = `${this.baseUrl}/projects/${projectId}/tasks/${taskId}/status/${studentId}`;
        
        console.log('Updating task status with URL:', url);
        console.log('New status:', newStatus);
        
        return this.http.put(url, null, {
          params: {
            status: newStatus
          }
        }).pipe(
          tap(response => {
            console.log('Task status updated successfully:', response);
            
            // Show success message to the student who updated the status
            this.showTemporaryNotification(`Task status updated to "${newStatus}" successfully`);
            
            // Get student name for the notification
            const studentName = task.student?.firstName || 'A student';
            
            // Create notification for the manager
            this.createNotification({
              id: Date.now(),
              type: 'STATUS_CHANGED',
              taskId: taskId,
              taskTitle: task.title,
              message: `${studentName} has changed the task "${task.title}" status to ${newStatus}`,
              timestamp: this.dateToString(new Date()),
              isRead: false,
              userId: task.projectManager?.id || 0, // Send to the manager
              senderId: studentId
            });
            
            // Refresh tasks list
            this.refreshTasksForProject(projectId);
          })
        );
      }),
      catchError(error => {
        console.error('Error updating task status:', error);
        return throwError(() => error);
      })
    );
  }
  
  // Get a specific task by ID
  getTaskById(projectId: number, taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/projects/${projectId}/tasks/${taskId}`).pipe(
      catchError(error => {
        console.error('Error getting task details:', error);
        return throwError(() => error);
      })
    );
  }
  
  // Delete a task
  // Delete a task
  deleteTask(projectId: number, taskId: number, userId: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/tasks/${taskId}/${userId}`).pipe(
    tap(() => {
      console.log(`Task ${taskId} deleted successfully`);
      
      // Show success message to the user who deleted the task
      this.showTemporaryNotification(`Task deleted successfully`);
      
      // Get the task details first to know who to notify
      this.getTaskById(projectId, taskId).subscribe({
        next: (task) => {
          // Get students for this project to notify them
          this.getStudentsForProject(projectId).subscribe(students => {
            students.forEach(student => {
              this.createNotification({
                id: Date.now(),
                type: 'TASK_DELETED',
                taskId: taskId,
                taskTitle: task.title,
                message: `Task "${task.title}" has been removed from your project`,
                timestamp: this.dateToString(new Date()),
                isRead: false,
                userId: student.id, // Send to each student
                senderId: userId
              });
            });
          });
        },
        error: () => {
          // If we can't get the task details, send a generic notification
          this.getStudentsForProject(projectId).subscribe(students => {
            students.forEach(student => {
              this.createNotification({
                id: Date.now(), 
                type: 'TASK_DELETED',
                taskId: taskId,
                message: `A task has been removed from your project`,
                timestamp: this.dateToString(new Date()),
                isRead: false,
                userId: student.id,
                senderId: userId
              });
            });
          });
        }
      });
      
      // Refresh tasks list
      this.refreshTasksForProject(projectId);
    }),
    catchError(error => {
      console.error('Error deleting task:', error);
      return throwError(() => error);
    })
  );
}

  getProjectManagers(): Observable<any[]> {
    const url = `${this.baseUrl}/project-managers`;
    console.log('Fetching managers from:', url);
    return this.http.get<any[]>(url).pipe(
      tap(response => console.log('Managers response:', response)),
      catchError(error => {
        console.error('Error fetching managers:', error);
        return throwError(() => error);
      })
    );
  }
  
  getProjectsByManager(managerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/managers/${managerId}/projects`);
  }
  
  updateTask(projectId: number, taskId: number, userId: number, task: Task): Observable<Task> {
    const url = `${this.baseUrl}/projects/${projectId}/tasks/${taskId}/${userId}`;
    
    console.log('Updating task:', {
        projectId,
        taskId,
        userId,
        task
    });
  
    // Return the HTTP PUT observable
    return this.http.put<Task>(url, task).pipe(
        tap(updatedTask => {
            console.log('Task updated successfully:', updatedTask);
            
            // Show success message to the user who updated the task
            this.showTemporaryNotification(`Task "${updatedTask.title}" updated successfully`);
            
            // Get students for this project to notify them
            this.getStudentsForProject(projectId).subscribe(students => {
              students.forEach(student => {
                this.createNotification({
                  id: Date.now(),
                  type: 'TASK_UPDATED',
                  taskId: taskId,
                  taskTitle: updatedTask.title,
                  message: `Task "${updatedTask.title}" has been updated`,
                  timestamp:this.dateToString(new Date()), 
                  isRead: false,
                  userId: student.id, // Send to each student
                  senderId: userId
                });
              });
            });
            
            // Refresh tasks list
            this.refreshTasksForProject(projectId);
        }),
        catchError(error => {
            console.error('Error updating task:', error);
            return throwError(() => new Error('Failed to update task'));
        })
    );
  }
  
  // Create a notification
  // Add this method to get notifications for a specific student
  getNotificationsForStudent(studentId: number): Observable<TaskNotification[]> {
    // In a real implementation, you would fetch from the backend
    // return this.http.get<TaskNotification[]>(`${this.baseUrl}/students/${studentId}/notifications`);
    
    // For now, filter the local notifications
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => n.userId === studentId || n.userId === 0))
    );
  }
  
 
  
  // Get notifications for a user
  getNotificationsForUser(userId: number): Observable<TaskNotification[]> {
    const url = `${this.baseUrl}/users/${userId}/notifications`;
    
    console.log(`Fetching notifications from: ${url}`);
    
    return this.http.get<TaskNotification[]>(url).pipe(
      tap(notifications => {
        console.log(`Fetched ${notifications.length} notifications for user ${userId}`);
      }),
      catchError(error => {
        console.error(`Error fetching notifications from ${url}:`, error);
        
        // If the API endpoint returns a 500 error, return mock data
        console.log('Returning mock notifications data');
        
        // Create some mock notifications based on the user ID
        const mockNotifications: TaskNotification[] = [
          {
            id: 1,
            type: 'TASK_CREATED',
            taskId: 101,
            taskTitle: 'Complete Project Documentation',
            message: 'New task "Complete Project Documentation" has been assigned to your project',
            timestamp: this.dateToString(new Date()),
            isRead: false,
            userId: userId,
            senderId: 2
          },
          {
            id: 2,
            type: 'FEEDBACK_ADDED',
            taskId: 102,
            taskTitle: 'Implement Login Feature',
            message: 'You received feedback on "Implement Login Feature"',
            timestamp: this.dateToString(new Date()),
            isRead: true,
            userId: userId,
            senderId: 3
          },
          {
            id: 3,
            type: 'STATUS_CHANGED',
            taskId: 103,
            taskTitle: 'Fix Navigation Bug',
            message: 'Task "Fix Navigation Bug" status has been changed to "In Progress"',
            timestamp: this.dateToString(new Date()),
            isRead: false,
            userId: userId,
            senderId: 4
          }
        ];
        
        // Update the local cache with these mock notifications
        this.notificationsSubject.next(mockNotifications);
        
        // Return the mock data
        return of(mockNotifications);
      })
    );
  }

// Update the createNotification method
public createNotification(notification: TaskNotification): void {
  // Update the local cache first for immediate display
  const currentNotifications = this.notificationsSubject.value;
  this.notificationsSubject.next([notification, ...currentNotifications]);
  
  // Then try to send to the backend using the correct URL format
  const senderId = notification.senderId || 0;
  const recipientId = notification.userId;
  const url = `${this.baseUrl}/users/${senderId}/notifications/to/${recipientId}`;
  
  console.log('Creating notification with URL:', url);
  console.log('Notification payload:', notification);
  
  this.http.post(url, notification).pipe(
    catchError(error => {
      console.warn('Error sending notification to API, notification will only be stored locally:', error);
      return of(null); // Return observable that completes
    })
  ).subscribe({
    next: (response) => {
      if (response) {
        console.log(`Notification created on server: ${notification.message} for user ${notification.userId}`);
      }
    }
  });
}

// Update the markNotificationAsRead method
markNotificationAsRead(notificationId: number): Observable<void> {
  // Send to the backend
  return this.http.put<void>(`${this.baseUrl}/notifications/${notificationId}/read`, {}).pipe(
    tap(() => {
      // Update the local cache
      const currentNotifications = this.notificationsSubject.value;
      const updatedNotifications = currentNotifications.map(notification => 
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      );
      this.notificationsSubject.next(updatedNotifications);
    }),
    catchError(error => {
      console.error('Error marking notification as read:', error);
      
      // Update local state anyway to provide a good user experience
      const currentNotifications = this.notificationsSubject.value;
      const updatedNotifications = currentNotifications.map(notification => 
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      );
      this.notificationsSubject.next(updatedNotifications);
      
      return of(undefined);
    })
  );
}
  
  


// Add this method to mark a single feedback as seen
markFeedbackAsSeen(feedbackId: number) {
  return this.http.patch<any>(
    `${this.baseUrl}/feedbacks/${feedbackId}/seen`,
    {}
  );
}


// Add this public method
public addNotification(notification: TaskNotification): void {
  this.createNotification(notification);
}



// Add this new method for temporary notifications
private showTemporaryNotification(message: string): void {
  // This is a placeholder - you'll need to implement a toast/snackbar service
  console.log('TEMPORARY NOTIFICATION:', message);
  
  // You can dispatch an event or use a service to show a toast notification
  // For example:
  // this.toastService.show(message, { classname: 'bg-success text-light', delay: 3000 });
}

// Add this method to get students for a project
getStudentsForProject(projectId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/projects/${projectId}/students`).pipe(
    catchError(error => {
      console.error('Error fetching students for project:', error);
      // Return empty array if API fails
      return of([]);
    })
  );
}

// Add or modify this method to set up faster task polling
setupTaskPolling(studentId: number, interval: number = 5000): Observable<Task[]> {
  console.log(`Setting up task polling for student ${studentId} every ${interval}ms`);
  
  // Initial fetch
  this.getTasksByStudentId(studentId).subscribe();
  
  // Return an observable that emits the latest tasks at the specified interval
  return timer(0, interval).pipe(
    switchMap(() => this.getTasksByStudentId(studentId)),
    catchError(error => {
      console.error('Error in task polling:', error);
      return of([]);
    })
  );
}}

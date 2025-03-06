import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Task } from '../models/task.model';
import { tap, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Update this URL to match your Spring Boot application port
  private baseUrl = 'http://localhost:8085/Interlink/api';

  constructor(private http: HttpClient) { }

  // Get all tasks for a project
  getTasksByProjectId(projectId: number): Observable<Task[]> {
    console.log(`Fetching tasks for project ${projectId}`);
    return this.http.get<Task[]>(`${this.baseUrl}/projects/${projectId}/tasks`);
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
  createTask(projectId: number, managerId: number,task: Task): Observable<Task> {
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
    return this.http.post<Task>(url, payload);
  }

  // Get a specific task
  getTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/projects/${projectId}/tasks`);
  }

  // Update task status
  updateTaskStatus(projectId: number, taskId: number, userId: number, status: string): Observable<Task> {
    return this.http.put<Task>(
      `${this.baseUrl}/projects/${projectId}/tasks/${taskId}/status/${userId}?status=${status}`, 
      {} // Send an empty body
    ).pipe(
      tap(response => console.log('Task status updated:', response)),
      catchError(error => {
        console.error('Error updating task status:', error);
        return throwError(() => error);
      })
    );
  }
  
  // Delete a task
  deleteTask(projectId: number, taskId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/tasks/${taskId}/${userId}`);
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
        }),
        catchError(error => {
            console.error('Error updating task:', error);
            // Optionally, you can use HttpErrorResponse for more detailed error handling
            return throwError(() => new Error('Failed to update task'));
        })
    );
  }
}
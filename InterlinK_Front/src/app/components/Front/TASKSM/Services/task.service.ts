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

  // Create a new task
  createTask(projectId: number, managerId: number,task: Task): Observable<Task> {
    const url = `${this.baseUrl}/projects/${projectId}/tasks/${managerId}`;
    
    const payload = {
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: 'Second_Level',
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
    return this.http.get<any[]>(`${this.baseUrl}/api/managers/${managerId}/projects`);
  }

  //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   //return this.http.post<Task>(`${this.baseUrl}/projects/${projectId}/tasks`, payload, { headers });

  
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

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
  createTask(projectId: number, managerId: number, task: Task): Observable<Task> {
    console.log('Creating task:', { projectId, managerId, task });
    return this.http.post<Task>(`${this.baseUrl}/projects/${projectId}/tasks/${managerId}`, task);
  }

  // Get a specific task
  getTasks(projectId: number): Observable<Task[]> {
    console.log(`Fetching tasks for project ${projectId}`);
    return this.http.get<Task[]>(`${this.baseUrl}/projects/${projectId}/tasks`);
  }

  

  // Update task status
  updateTaskStatus(projectId: number, taskId: number, userId: number, status: string): Observable<Task> {
    return this.http.put<Task>(
      `${this.baseUrl}/projects/${projectId}/tasks/${taskId}/status/${userId}`, 
      { status } // Send status in the request body
    );
  }

  // Delete a task
  deleteTask(projectId: number, taskId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/tasks/${taskId}/${userId}`);
  }

  

  getProjectManagers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/project-managers`);
  }
  
  getProjectsByManager(managerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/managers/${managerId}/projects`);
  }

  //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  // return this.http.post<Task>(`${this.baseUrl}/projects/${projectId}/tasks`, payload, { headers });

  
}
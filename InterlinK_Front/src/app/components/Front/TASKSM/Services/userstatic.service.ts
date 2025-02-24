import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8085/api';

  constructor(private http: HttpClient) { }

  getProjectManagers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/project-managers`);
  }

  getProjectsByManager(managerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/managers/${managerId}/projects`);
  }
}
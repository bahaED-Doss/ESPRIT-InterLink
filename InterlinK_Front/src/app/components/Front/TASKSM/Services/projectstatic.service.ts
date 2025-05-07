import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:8085/Interlink';

  constructor(private http: HttpClient) { }

  getProjectsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/users/${userId}/projects`);
  }
  getProjectsByManager(managerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/managers/${managerId}/projects`);
  }
}
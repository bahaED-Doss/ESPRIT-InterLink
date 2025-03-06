import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


interface Project {
  projectId: number;
  name: string;
  description?: string;
}
@Injectable({
  providedIn: 'root'
})

export class UserService {
  private baseUrl = 'http://localhost:8085/Interlink/api';

  constructor(private http: HttpClient) { }

  getStudents(): Observable<any[]> {
    const url = `${this.baseUrl}/students`;
    console.log('Fetching students from:', url);
    return this.http.get<any[]>(url).pipe(
      tap(response => console.log('Students response:', response)),
      catchError(error => {
        console.error('Error fetching students:', error);
        return throwError(() => error);
      })
    );
  }

  getStudentProjects(studentId: number): Observable<any[]> {
    const url = `${this.baseUrl}/users/${studentId}/project`;
    console.log('Fetching student projects from:', url);
    return this.http.get<any[]>(url).pipe(
      tap(response => console.log('Student projects response:', response)),
      catchError(error => {
        console.error('Error fetching student projects:', error);
        return throwError(() => error);
      })
    );
  }

  getStudentById(studentId: number): Observable<any> {
    const url = `${this.baseUrl}/students/${studentId}`;
    console.log('Fetching student details from:', url);
    return this.http.get<any>(url).pipe(
      tap(response => console.log('Student details response:', response)),
      catchError(error => {
        console.error('Error fetching student details:', error);
        // Return a mock student for testing purposes
        return of({
          id: studentId,
          name: 'Student ' + studentId,
          email: `student${studentId}@example.com`
        });
      })
    );
  }
  getProjectByStudentId(userId: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/users/${userId}/project`);
  }

  getProjectById(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/projects/${projectId}`;
    console.log('Fetching project details from:', url);
    return this.http.get<any>(url).pipe(
      tap(response => console.log('Project details response:', response)),
      catchError(error => {
        console.error('Error fetching project details:', error);
        // Return a mock project for testing purposes
        return of({
          projectId: projectId,
          name: 'Project ' + projectId,
          description: 'This is a sample project description for testing purposes.'
        });
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  projectId: number;
  title: string;
  description: string;
  startDate: string;  // or Date if you prefer
  endDate: string;    // or Date if you prefer
  company: {
    name: string;
  };
  status: string;
  technologiesUsed: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8081/Interlink/projects'; // Adjust the URL if needed

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/retrieve-all-projects`);
  }

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/add-project`, project);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/modify-project/${project.projectId}`, project);
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-project/${projectId}`);
  }
}

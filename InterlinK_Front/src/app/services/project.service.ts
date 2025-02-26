import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from './company.service';

export interface Project {
  projectId?: number;
  title: string;
  description: string;
  startDate: string; // ISO format (YYYY-MM-DD)
  endDate: string;
  company: Company;
  status: string;
  technologiesUsed: string; // Changed to string (comma-separated)
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8081/Interlink/projects';

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/retrieve-all-projects`);
  }

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/add-project`, project);
  }

  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/project-by-id/${projectId}`);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/modify-project/${project.projectId}`, project);
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-project/${projectId}`);
  }
}

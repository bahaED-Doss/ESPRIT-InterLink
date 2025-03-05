import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from './company.service';

export interface Milestone {
  id: any;
  milestoneId: number;
  name: string;
  status: string;  // Could be an enum or string
  projectId: number;
  // Add other fields if necessary based on your backend response
}

export interface Project {
  projectId: number;
  title: string;
  description: string;
  startDate: string; // ISO format (YYYY-MM-DD)
  endDate: string;
  company: Company;
  status: string;
  technologiesUsed: string; // Changed to string (comma-separated)
  milestones: Milestone[]; // Added milestones field with an array of Milestone
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

  getProjectProgress(projectId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${projectId}/progress`);
  }

  // Method to update the milestone status
  updateMilestoneStatus(projectId: number, milestoneId: number, newStatus: string): Observable<Milestone> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    // Call the backend API to update milestone status with just the status string
    return this.http.put<Milestone>(
      `${this.apiUrl}/${projectId}/milestone/${milestoneId}/update-status`,
      newStatus // Send the status directly as a string
    );
  }
  searchProjects(keyword: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }
  
  
}

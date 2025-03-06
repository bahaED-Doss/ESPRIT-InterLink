import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver'; // Import file-saver for saving the PDF
import { Company } from './company.service';

export interface Milestone {
  id: any;
  milestoneId: number;
  name: string;
  status: string;
  projectId: number;
}

export interface Project {
  projectId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  company: Company;
  status: string;
  technologiesUsed: string;
  milestones: Milestone[];
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

  updateMilestoneStatus(projectId: number, milestoneId: number, newStatus: string): Observable<Milestone> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Milestone>(
      `${this.apiUrl}/${projectId}/milestone/${milestoneId}/update-status`,
      newStatus
    );
  }

  searchProjects(keyword: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }

  getProjectStatusStatistics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/statistics/status`);
  }

  // New method for downloading the PDF
  generateProjectsPdf(): void {
    this.http.get(`${this.apiUrl}/generate-pdf-all-projects`, {
      responseType: 'blob'  // Expecting a binary file
    }).subscribe({
      next: (blob) => {
        saveAs(blob, 'projects.pdf'); // Save the PDF file
      },
      error: (error) => {
        console.error('Error generating PDF:', error);
      }
    });
  }
  generateProjectsExcel(): void {
    this.http.get(`${this.apiUrl}/generate-projects-excel`, { responseType: 'blob' })
      .subscribe(blob => {
        saveAs(blob, 'projects.xlsx');
      }, error => {
        console.error('Error generating Excel:', error);
      });
  }
  }

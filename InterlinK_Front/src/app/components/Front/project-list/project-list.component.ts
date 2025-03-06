import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver'; // Don't forget to install file-saver!

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  projectStatistics: any[] = []; // Store statistics
  searchKeyword: string = "";

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadProjectStatistics(); // Fetch statistics
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(data => {
      this.projects = data.map(p => ({
        ...p,
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate)
      }));
    });
  }

  loadProjectStatistics(): void {
    this.projectService.getProjectStatusStatistics().subscribe(data => {
      this.projectStatistics = data;
    });
  }

  goToProjectDetails(projectId: number): void {
    if (!this.router) {
      console.error("Router is undefined!"); 
      return;
    }
    this.router.navigate(['/projectDetails', projectId]); 
  }

  searchProjects(): void {
    if (!this.searchKeyword.trim()) {
      this.loadProjects(); // Reload all projects if search is empty
      return;
    }

    this.projectService.searchProjects(this.searchKeyword).subscribe(data => {
      this.projects = data.map(p => ({
        ...p,
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate)
      }));
    });
  }

  deleteProject(project: any): void {
    if (!project || !project.projectId) {
      console.error("Error: Project ID is undefined.");
      return;
    }

    const confirmation = confirm(`Are you sure you want to delete "${project.title}"?`);
    if (!confirmation) return;

    this.projectService.deleteProject(project.projectId).subscribe({
      next: () => {
        alert(`"${project.title}" deleted successfully`);
        this.loadProjects(); // Refresh the list after deletion
      },
      error: (err) => {
        console.error("Error deleting project:", err);
      }
    });
  }

  // Method to generate and download PDF for all projects
  downloadProjectsPdf(): void {
    this.projectService.generateProjectsPdf();
  }

  // Method to generate and download Excel for all projects
  downloadProjectsExcel(): void {
    this.projectService.generateProjectsExcel();
  }
}

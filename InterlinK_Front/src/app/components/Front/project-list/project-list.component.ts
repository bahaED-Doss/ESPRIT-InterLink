import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Router } from '@angular/router'; 



@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  skills: string[] = ['Project Management', 'Teamwork', 'Problem Solving', 'Agile Development'];
  technologies: string[] = ['Angular', 'Spring Boot', 'PostgreSQL', 'Docker'];

  constructor(private projectService: ProjectService ,private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
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
  goToProjectDetails(projectId: number): void {
    if (!this.router) {
      console.error("Router is undefined!"); 
      return;
    }
    this.router.navigate(['/projectDetails', projectId]); 
  }
  searchKeyword: string = "";

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

    console.log("Deleting Project:", project); 
    console.log("Project ID:", project.projectId); 

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
}

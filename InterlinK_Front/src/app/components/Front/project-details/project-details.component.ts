import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/services/company.service';
import { ProjectService, Project, Milestone } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project = {
    projectId: 0,
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    company: { companyId: 0, name: '' } as Company,
    status: '',
    technologiesUsed: '',
    milestones: [] // Initialize milestones as an empty array
  };

  technologies: string[] = ['Angular', 'Spring Boot', 'SQL', 'Docker', 'Node.js', 'TensorFlow', 'Java'];

  tasks = {
    todo: [
      { title: "Setup project repository" },
      { title: "Define database schema" }
    ],
    doing: [
      { title: "Develop backend API" }
    ],
    done: [
      { title: "Finalize UI design" }
    ]
  };

  progress: number = 0;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      const projectIdNum = Number(projectId);
      if (!isNaN(projectIdNum)) {
        this.loadProject(projectIdNum);
        this.getProjectProgress(projectIdNum);
      } else {
        console.error('Invalid project ID');
      }
    } else {
      console.error('Project ID is missing in the route parameters');
    }
  }
  

  loadProject(id: number): void {
    this.projectService.getProjectById(id).subscribe(data => {
      console.log('API response data:', data);  // Log the full response data
      this.project = data;
      console.log('Project data:', this.project);  // Check if company is included
      this.project.technologiesUsed = this.project.technologiesUsed || '';
      this.project.milestones = this.project.milestones || [];
    }, error => {
      console.error('Error fetching project', error);
    });
  }
  

  getProjectProgress(projectId: number): void {
    this.projectService.getProjectProgress(projectId).subscribe(progress => {
      this.progress = progress;
    }, error => {
      console.error('Error fetching project progress', error);
    });
  }

  isTechnologySelected(tech: string): boolean {
    return this.project.technologiesUsed.split(',').map(t => t.trim()).includes(tech);
  }

  toggleTechnologySelection(tech: string): void {
    let techArray = this.project.technologiesUsed ? this.project.technologiesUsed.split(',').map(t => t.trim()) : [];
    if (techArray.includes(tech)) {
      techArray = techArray.filter(t => t !== tech);
    } else {
      techArray.push(tech);
    }
    this.project.technologiesUsed = techArray.join(', ');
  }

  updateProject(): void {
    this.projectService.updateProject(this.project).subscribe(response => {
      alert('Project updated successfully');
    }, error => {
      console.error('Error updating project', error);
    });
  }

  // Fixed updateMilestoneStatus
  updateMilestoneStatus(milestone: Milestone): void {
    console.log('Milestone object:', milestone);
    console.log('Milestone ID:', milestone.id);
    console.log('Project ID:', this.project.projectId);

    if (!milestone.id || !this.project.projectId) {
      console.error('Invalid milestone or project ID');
      return;
    }

    // Send the status directly as a string
    const statusUpdate = milestone.status;  // Just the status string, not an object

    this.projectService.updateMilestoneStatus(this.project.projectId, milestone.id, statusUpdate)
      .subscribe(
        (updatedMilestone: Milestone) => {
          console.log('Updated milestone:', updatedMilestone);
          const milestoneIndex = this.project.milestones.findIndex(m => m.id === updatedMilestone.id);
          if (milestoneIndex !== -1) {
            this.project.milestones[milestoneIndex].status = updatedMilestone.status;
          }
          this.getProjectProgress(this.project.projectId);
        },
        error => {
          console.error('Error updating milestone status', error);
        }
      );
  }
}

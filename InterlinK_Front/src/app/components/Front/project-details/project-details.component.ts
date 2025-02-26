import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/services/company.service';
import { ProjectService, Project } from 'src/app/services/project.service';

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
    company: {
      companyId: 0,
      name: '',
      location: '',
      email: '',
      city: '',
      country: '',
      phone: '',
      industrySector: ''
    } as Company,
    status: '',
    technologiesUsed: '' // Now it's a string
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

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(Number(projectId));
    }
  }

  loadProject(id: number): void {
    this.projectService.getProjectById(id).subscribe(data => {
      this.project = data;
      // Ensure technologiesUsed is always a string and avoid null values
      this.project.technologiesUsed = this.project.technologiesUsed || '';
    }, error => {
      console.error('Error fetching project', error);
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

    this.project.technologiesUsed = techArray.join(', '); // Convert back to string
  }

  updateProject(): void {
    this.projectService.updateProject(this.project).subscribe(response => {
      alert('Project updated successfully');
    }, error => {
      console.error('Error updating project', error);
    });
  }
}

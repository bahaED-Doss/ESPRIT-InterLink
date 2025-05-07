import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/project.service';
import { CompanyService } from 'src/app/services/company.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  addProject!: FormGroup;
  companies: any[] = [];
  technologies: string[] = ['Angular', 'Spring Boot', 'SQL', 'Docker', 'Node.js', 'TensorFlow', 'Java'];
  selectedTechnologies: string = ''; // Use a string instead of an array

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private companyService: CompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addProject = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      technologiesUsed: [''], // Bind to a string
      status: ['Open'], // Default value
      companyId: ['', Validators.required] // Add this for the company selection
    });

    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe(data => {
      this.companies = data;
    });
  }

  onTechnologyChange(event: any): void {
    const tech = event.target.value;
    if (event.target.checked) {
      this.selectedTechnologies += this.selectedTechnologies ? `, ${tech}` : tech;
    } else {
      this.selectedTechnologies = this.selectedTechnologies
        .split(', ')
        .filter(t => t !== tech)
        .join(', ');
    }
    this.addProject.get('technologiesUsed')?.setValue(this.selectedTechnologies);
  }

  isTechnologySelected(tech: string): boolean {
    return this.selectedTechnologies.includes(tech);
  }

  submitForm(): void {
    if (this.addProject.valid) {
      console.log('Submitting Project:', this.addProject.value);
      this.projectService.addProject(this.addProject.value).subscribe(() => {
        alert('Project added successfully!');
        this.router.navigate(['/projectList']);
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
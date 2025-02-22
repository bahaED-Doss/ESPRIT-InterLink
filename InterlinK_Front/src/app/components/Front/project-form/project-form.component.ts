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
  technologies: string[] = ['Angular', 'Spring Boot', 'PostgreSQL', 'Docker', 'Node.js'];

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
      company: ['', Validators.required],
      location: ['', Validators.required],
      technologies: [[]]
    });

    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe(data => {
      this.companies = data;
    });
  }

  submitForm(): void {
    if (this.addProject.valid) {
      this.projectService.addProject(this.addProject.value).subscribe(() => {
        alert('Project added successfully!');
        this.router.navigate(['/projects']);
      });
    }
  }
}

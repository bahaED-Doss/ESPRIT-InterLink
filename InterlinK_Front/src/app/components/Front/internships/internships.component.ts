import { Component, OnInit } from '@angular/core';
import { InternshipService } from '../../../services/internship.service';
import { Internship } from 'src/app/models/Internship.model';
import { Application, ApplicationStatus } from 'src/app/models/Application.model';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.css'],
})
export class InternshipsComponent implements OnInit {
  internships: Internship[] = [];
  filteredInternships: Internship[] = [];
  selectedInternship: Internship | null = null;
  application: Application = {
    applicationId: 0,
    internship: null,
    status: ApplicationStatus.PENDING,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    cv: '',
    internshipId: 0,
  };

  // Filtres
  locationFilter: string = '';
  durationFilter: string = '';
  typeFilter: string = '';

  constructor(private internshipService: InternshipService) {}

  ngOnInit(): void {
    this.getInternships();
  }

  getInternships(): void {
    this.internshipService.getInternships().subscribe((data: Internship[]) => {
      this.internships = data;
      this.filteredInternships = data; // Initialise les stages filtrés
    });
  }

  applyFilters(): void {
    this.filteredInternships = this.internships.filter((internship) => {
      const matchesLocation = internship.localisation
        .toLowerCase()
        .includes(this.locationFilter.toLowerCase());
      const matchesDuration = this.durationFilter
        ? internship.duration === this.durationFilter
        : true;
      const matchesType = this.typeFilter
        ? internship.type === this.typeFilter
        : true;
      return matchesLocation && matchesDuration && matchesType;
    });
  }

  applyForInternship(internship: Internship): void {
    this.selectedInternship = internship;
    this.application.internshipId = internship.internshipId;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.application.cv = file;
    }
  }

  submitApplication(): void {
    // Logique pour soumettre la candidature
  }

  cancelApplication(): void {
    this.selectedInternship = null;
    this.application = {
      applicationId: 0,
      internship: null,
      status: ApplicationStatus.PENDING,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      cv: '',
      internshipId: 0,
    };
  }
}
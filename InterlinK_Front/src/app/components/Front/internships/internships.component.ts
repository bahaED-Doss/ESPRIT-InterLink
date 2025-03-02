import { Component, OnInit } from '@angular/core';
import { InternshipService } from '../../../services/internship.service';
import { ApplicationService } from '../../../services/application.service';
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

  constructor(
    private internshipService: InternshipService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.getInternships();
  }

  // Récupérer tous les stages
  getInternships(): void {
    this.internshipService.getInternships().subscribe({
      next: (data: Internship[]) => {
        this.internships = data;
        this.filteredInternships = data; // Initialiser les stages filtrés
      },
      error: (error: any) => {
        alert('Error fetching internships. Please try again.');
      },
    });
  }

  // Appliquer les filtres
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

  // Postuler pour un stage
  applyForInternship(internship: Internship): void {
    this.selectedInternship = internship;
    this.application.internshipId = internship.internshipId;
  }

  // Gérer la sélection de fichier (CV)
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.application.cv = file;
    }
  }

  // Soumettre une candidature
  submitApplication(): void {
    if (this.selectedInternship) {
      this.application.internship = this.selectedInternship;
      this.application.status = ApplicationStatus.PENDING;

      this.applicationService.addApplication(this.application).subscribe({
        next: (response: Application) => {
          alert('Application submitted successfully!');
          this.cancelApplication();
        },
        error: (error: any) => {
          alert('Error submitting application. Please try again.');
        },
      });
    }
  }

  // Modifier une candidature
  editApplication(application: Application): void {
    this.selectedInternship = application.internship;
    this.application = { ...application }; // Copier les données de la candidature dans le formulaire
  }

  // Mettre à jour une candidature
  updateApplication(): void {
    if (this.application.applicationId) {
      this.applicationService
        .updateApplication(this.application.applicationId, this.application)
        .subscribe({
          next: (response: Application) => {
            alert('Application updated successfully!');
            this.cancelApplication();
          },
          error: (error: any) => {
            alert('Error updating application. Please try again.');
          },
        });
    }
  }

  // Supprimer une candidature
  deleteApplication(applicationId: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationService.deleteApplication(applicationId).subscribe({
        next: () => {
          alert('Application deleted successfully!');
          this.getInternships(); // Recharger la liste des stages
        },
        error: (error: any) => {
          alert('Error deleting application. Please try again.');
        },
      });
    }
  }

  // Annuler la candidature
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
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InternshipService } from '../../../services/internship.service';
import { ApplicationService } from '../../../services/application.service';
import { Internship } from 'src/app/models/Internship.model';
import { Application, ApplicationStatus } from 'src/app/models/Application.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RatingService } from 'src/app/services/rating.service';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.css'],
})
export class InternshipsComponent implements OnInit {
  internships: Internship[] = [];
  applications: Application[] = [];
  addApplicationForm: FormGroup;
  ApplicationStatus = ApplicationStatus;
  filteredInternships: Internship[] = [];
  selectedInternship: Internship | null = null;
  selectedRating = 0;
  ratingComment = '';
  selectedInternshipForRating: Internship | null = null;

  // Filters
  locationFilter: string = '';
  durationFilter: string = '';
  typeFilter: string = '';

  @ViewChild('addApplicationModal', { read: TemplateRef }) addApplicationModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private internshipService: InternshipService,
    private applicationService: ApplicationService,
    private ratingService: RatingService
  ) {
    this.addApplicationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      cv: [null, Validators.required],
      status: [ApplicationStatus.PENDING, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getInternships();
  }

  // Rating methods
  openRatingModal(internship: Internship): void {
    this.selectedInternshipForRating = internship;
  }

  submitRating(): void {
    if (this.selectedRating === 0 || !this.selectedInternshipForRating) return;

    this.ratingService.addRating(
      this.selectedInternshipForRating.internshipId,
      this.selectedRating,
      this.ratingComment
    ).subscribe(() => {
      this.selectedInternshipForRating = null;
      this.selectedRating = 0;
      this.ratingComment = '';
    });
  }

  getRating(internshipId: number): number {
    return this.ratingService.getAverageRating(internshipId);
  }

  getRatingCount(internshipId: number): number {
    return this.ratingService.getRatings(internshipId).length;
  }

  hasRated(internshipId: number): boolean {
    // Implement logic to check if current user has rated
    return false;
  }

  // Rest of your existing methods...
  getInternships(): void {
    this.internshipService.getInternships().subscribe({
      next: (data: Internship[]) => {
        this.internships = data;
        this.filteredInternships = data;
      },
      error: (error: any) => {
        alert('Error fetching internships. Please try again.');
      },
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

 
  
  application: Application = {
    applicationId: 0,
    status: ApplicationStatus.PENDING, // Remplace par la valeur par défaut appropriée
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    cv: '',
    internshipId: 0,
    internship: null
  };
  // Method to format enum values
formatEnumValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

 // Method to get enum values
 getEnumValues(enumObject: any): string[] {
  return Object.values(enumObject);
}
  // Postuler pour un stage
  applyForInternship(internship: Internship): void {
    this.selectedInternship = internship;
    this.application.internshipId = internship.internshipId;
    this.application.internship = internship; // Assign the internship object
  }


  // Gérer la sélection de fichier (CV)
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      console.log("Fichier encodé :", reader.result); // Vérification
      this.addApplicationForm.patchValue({ cv: reader.result  });
    };
    reader.readAsDataURL(file);
  }
}

  
  openAddApplicationModal(internship: Internship): void {
    this.modalService.open(this.addApplicationModal);
  }
  
 

  // Soumettre une candidature
 
onSubmitAddApplication():void{
  if (this.addApplicationForm.invalid)return;
  if (this.addApplicationForm.invalid || !this.selectedInternship) {
    alert("Veuillez sélectionner un stage avant de postuler !");
    return;
  }
 const applicationData = {
    ...this.addApplicationForm.value,
    internshipId: this.selectedInternship?.internshipId // Ajouter l'ID du stage
  };
  applicationData.status = this.addApplicationForm.value.status; // Assigner le statut

    this.applicationService.addApplication(applicationData).subscribe(()=>{
    this.modalService.dismissAll();
    this.addApplicationForm.reset();
    this.getApplications();
  })
}
  getApplications() {
    this.applicationService.getApplications().subscribe((data: Application[]) => {
      this.applications = data;
    });
  }

  

  // Modifier une candidature
  editApplication(application: Application): void {
    this.selectedInternship = application.internship || null; // Ensure it's null if undefined
    this.application = { ...application }; // Copy the application data
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
      status: ApplicationStatus.PENDING,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      cv: '', // Réinitialiser à une chaîne vide
      internshipId: 0,
      internship: null,
    };
  }
  

}
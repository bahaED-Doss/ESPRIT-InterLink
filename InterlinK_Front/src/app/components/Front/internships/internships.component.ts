import { Component, OnInit } from '@angular/core';
import { InternshipService } from '../../../services/internship.service';
import { Internship } from 'src/app/models/Internship.model';
import { Application, ApplicationStatus } from 'src/app/models/Application.model';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.css']
})
export class InternshipsComponent implements OnInit {
  internships: Internship[] = [];
  selectedInternship: Internship | null = null;
  application: Application = {
    applicationId: 0,
    internship: null,
    status: ApplicationStatus.APPROVED, // Ou une autre valeur
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    cv: '',
    internshipId: 0
  };

  constructor(private internshipService: InternshipService) {}

  ngOnInit(): void {
    this.getInternships();
  }

  getInternships(): void {
    this.internshipService.getInternships().subscribe((data: Internship[]) => {
      this.internships = data;
    });
  }

  applyForInternship(internship: Internship): void {
    this.selectedInternship = internship;
    this.application.internshipId = internship.internshipId;
    this.application.internship = internship;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.application.cv = file;
    }
  }

  submitApplication(): void {
    if (!this.application.firstName || !this.application.lastName || !this.application.email || !this.application.phoneNumber || !this.application.cv) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.application.firstName);
    formData.append('lastName', this.application.lastName);
    formData.append('email', this.application.email);
    formData.append('phoneNumber', this.application.phoneNumber);
    formData.append('cv', this.application.cv);
    formData.append('internshipId', this.application.internshipId.toString());

    this.internshipService.applyForInternship(formData).subscribe(
      (response: Application) => { // <-- Supposons que l'API renvoie l'application mise à jour
        alert('Candidature envoyée avec succès !');
        this.application.status = response.status; // <-- Mise à jour locale du statut
        this.cancelApplication();
      },
      error => {
        alert('Erreur lors de l\'envoi de la candidature.');
      }
    );
    
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
      internshipId: 0
    };
  }
}

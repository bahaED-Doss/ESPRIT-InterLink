import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../../services/application.service';
import { Application, ApplicationStatus } from '../../../../models/Application.model';
import { AsideComponent } from "../../aside/aside.component";
import { FooterBackComponent } from "../../footer-back/footer-back.component";
import { SettingsComponent } from "../../settings/settings.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.css'],
  standalone: true,
  imports: [AsideComponent, FooterBackComponent, SettingsComponent, CommonModule, FormsModule],
})
export class AddApplicationComponent implements OnInit {
  application: Application = {
    applicationId: 0,
    status: ApplicationStatus.PENDING,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    cv: '',
    internshipId: 0,
    internship: undefined
  };

  message: { text: string, type: string } | null = null;
  errors: { [key: string]: string } = {}; // Ajout des erreurs

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  validateForm(): boolean {
    this.errors = {}; // Réinitialiser les erreurs

    // Validation du prénom
    if (!this.application.firstName) {
      this.errors['firstName'] = 'Le prénom est requis.';
    }

    // Validation du nom
    if (!this.application.lastName) {
      this.errors['lastName'] = 'Le nom est requis.';
    }

    // Validation de l'email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(this.application.email)) {
      this.errors['email'] = 'L\'email est invalide.';
    }

    // Validation du numéro de téléphone
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(this.application.phoneNumber)) {
      this.errors['phoneNumber'] = 'Le numéro de téléphone est invalide.';
    }

    // Validation du CV
    if (!this.application.cv) {
      this.errors['cv'] = 'Le CV est requis.';
    }

    // Validation de l'ID du stage
    if (this.application.internshipId <= 0) {
      this.errors['internshipId'] = 'L\'ID du stage est invalide.';
    }

    return Object.keys(this.errors).length === 0;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return; // Ne pas soumettre si des erreurs existent
    }

    this.applicationService.addApplication(this.application).subscribe(
      (data) => {
        this.message = { text: 'Candidature ajoutée avec succès!', type: 'success' };
        setTimeout(() => {
          this.router.navigate(['/applications-back']);
        }, 2000);
      },
      (error) => {
        this.message = { text: 'Erreur lors de l\'ajout de la candidature. Veuillez réessayer.', type: 'error' };
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/applications-back']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../../services/application.service'; // Service pour l'application
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
  imports: [AsideComponent, FooterBackComponent, SettingsComponent,CommonModule, FormsModule],
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

  message: { text: string, type: string } | null = null; // Message d'alerte

  constructor(
    private applicationService: ApplicationService, // Service pour l'application
    private router: Router // Injection de Router pour la navigation
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.applicationService.addApplication(this.application).subscribe(
      (data) => {
        this.message = { text: 'Candidature ajoutée avec succès!', type: 'success' };
        setTimeout(() => {
          this.router.navigate(['/applications-back']); // Redirection vers la page des candidatures
        }, 2000); // Attendre 2 secondes avant de rediriger
      },
      (error) => {
        this.message = { text: 'Erreur lors de l\'ajout de la candidature. Veuillez réessayer.', type: 'error' };
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/applications-back']); // Redirection vers la page des candidatures
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AsideComponent } from '../aside/aside.component';
import { SettingsComponent } from '../settings/settings.component';
import { FooterBackComponent } from '../footer-back/footer-back.component';
import { Application } from '../../../models/Application.model';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-applications-back',
  standalone: true,
  imports: [CommonModule, RouterModule, AsideComponent, SettingsComponent, FooterBackComponent], 
  templateUrl: './applications-back.component.html',
  styleUrls: ['./applications-back.component.css']
})
export class ApplicationsBackComponent implements OnInit {
  selectedApplication?: Application;
  isModalOpen = false;



  applications: Application[] = [];

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getApplications();
  }
  

  // ✅ Récupérer les candidatures depuis le backend
  getApplications(): void {
    this.applicationService.getApplications().subscribe(
        (data: Application[]) => {
            this.applications = data;
            console.log('Candidatures récupérées:', this.applications); // Log des données
        },
        (error) => {
            console.error('Erreur lors de la récupération des candidatures:', error);
        }
    );
}

  // ✅ Ajouter une candidature
  addApplication(newApplication: Application): void {
    this.applicationService.addApplication(newApplication).subscribe(() => {
      this.getApplications(); // Rafraîchir la liste après ajout
    });
  }

  // ✅ Modifier une candidature (Redirection vers une page d'édition)
  editApplication(application: Application): void {
    this.router.navigate(['/edit-application', application.applicationId]);
  }

  // ✅ Supprimer une candidature
  deleteApplication(applicationId: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette candidature ?')) {
        this.applicationService.deleteApplication(applicationId).subscribe(() => {
            this.applications = this.applications.filter(app => app.applicationId !== applicationId);
        });
    }
}
  openAddApplicationModal(): void {
    // Vous pouvez soit utiliser un modal, soit rediriger vers une nouvelle page.
    this.router.navigate(['/add-application']); // Remplacez par votre route
  }

}

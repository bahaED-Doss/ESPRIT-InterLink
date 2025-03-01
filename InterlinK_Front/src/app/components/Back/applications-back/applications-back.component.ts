import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AsideComponent } from '../aside/aside.component';
import { SettingsComponent } from '../settings/settings.component';
import { FooterBackComponent } from '../footer-back/footer-back.component';
import { Application } from '../../../models/Application.model';
import { ApplicationService } from '../../../services/application.service';
import { NavBackComponent } from "../nav-back/nav-back.component";

@Component({
  selector: 'app-applications-back',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule, AsideComponent, SettingsComponent, FooterBackComponent, NavBackComponent],
  templateUrl: './applications-back.component.html',
  styleUrls: ['./applications-back.component.css']
})
export class ApplicationsBackComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getApplications();
  }

  // Récupérer les candidatures
  getApplications(): void {
    this.applicationService.getApplications().subscribe(
      (data: Application[]) => {
        this.applications = data;
        this.filteredApplications = data; // Initialiser les données filtrées
      },
      (error) => {
        console.error('Erreur lors de la récupération des candidatures:', error);
      }
    );
  }

  // Appliquer le filtre de recherche
  applyFilter(): void {
    this.filteredApplications = this.applications.filter(application =>
      application.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      application.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      application.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      application.phoneNumber.toLowerCase().includes(this.searchText.toLowerCase()) ||
      application.status.toLowerCase().includes(this.searchText.toLowerCase()) ||
      application.internship?.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.currentPage = 1; // Réinitialiser la pagination après la recherche
  }

  // Trier les données
  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredApplications.sort((a, b) => {
      const valueA = this.getPropertyValue(a, column);
      const valueB = this.getPropertyValue(b, column);

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Obtenir la valeur d'une propriété imbriquée
  getPropertyValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
  }

  // Obtenir l'icône de tri
  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? '▲' : '▼';
    }
    return '';
  }

  // Méthodes existantes
  editApplication(application: Application): void {
    this.router.navigate(['/edit-application', application.applicationId]);
  }

  deleteApplication(applicationId: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette candidature ?')) {
      this.applicationService.deleteApplication(applicationId).subscribe(() => {
        this.applications = this.applications.filter(app => app.applicationId !== applicationId);
        this.filteredApplications = this.filteredApplications.filter(app => app.applicationId !== applicationId);
      });
    }
  }

  openAddApplicationModal(): void {
    this.router.navigate(['/add-application']);
  }
}
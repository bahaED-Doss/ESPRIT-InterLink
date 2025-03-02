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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationStatus } from '../../../models/Application.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-applications-back',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule, AsideComponent, SettingsComponent, FooterBackComponent, NavBackComponent, ReactiveFormsModule],
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

  addApplicationForm: FormGroup;
  editApplicationForm: FormGroup;
  ApplicationStatus = ApplicationStatus; 
  activeChart: 'bar' | 'pie' | null = null;

  // Statistiques pour les statuts
  statusStats: { status: string, count: number }[] = [];

  // Couleurs pour le camembert
  colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
modalService: any;
internships: any;

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private router: Router
  ) {
    // Formulaire d'ajout
    this.addApplicationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      status: [ApplicationStatus.PENDING, Validators.required], // Utiliser l'énumération
      cv: ['', Validators.required],
      internshipId: ['', Validators.required],
    });

    // Formulaire de modification
    this.editApplicationForm = this.fb.group({
      applicationId: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      status: ['', Validators.required],
      cv: ['', Validators.required],
      internshipId: ['', Validators.required],
    });
  }

  // Soumettre le formulaire d'ajout
onSubmitAddApplication(): void {
  if (this.addApplicationForm.invalid) return;

  const applicationData = this.addApplicationForm.value;
  this.applicationService.addApplication(applicationData).subscribe({
    next: () => {
      this.modalService.dismissAll();
      this.addApplicationForm.reset();
      this.getApplications(); // Rafraîchir la liste
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout de la candidature :', err);
    },
  });
}

// Soumettre le formulaire de modification
onSubmitEditApplication(): void {
  if (this.editApplicationForm.invalid) return;

  const applicationData = this.editApplicationForm.value;
  this.applicationService.updateApplication(applicationData.applicationId, applicationData).subscribe({
    next: () => {
      this.modalService.dismissAll();
      this.getApplications(); // Rafraîchir la liste
    },
    error: (err) => {
      console.error('Erreur lors de la modification de la candidature :', err);
    },
  });
}
  // Méthode pour obtenir les valeurs d'une enum
getEnumValues(enumObject: any): string[] {
  return Object.values(enumObject);
}

// Méthode pour formater les valeurs des enums
formatEnumValue(value: string): string {
  return value
    .toLowerCase() // Convertir en minuscules
    .replace(/_/g, ' ') // Remplacer les underscores par des espaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitaliser chaque mot
}

  ngOnInit(): void {
    this.getApplications();
  }

  // Récupérer les candidatures
  getApplications(): void {
    this.applicationService.getApplications().subscribe(
      (data: Application[]) => {
        this.applications = data;
        this.filteredApplications = data; // Initialiser les données filtrées
        this.calculateStatusStats(); // Calculer les statistiques
      },
      (error) => {
        console.error('Erreur lors de la récupération des candidatures:', error);
      }
    );
  }
 // Calculate status statistics
 calculateStatusStats(): void {
  const statusMap = new Map<string, number>();

  this.applications.forEach(application => {
    if (statusMap.has(application.status)) {
      statusMap.set(application.status, statusMap.get(application.status)! + 1);
    } else {
      statusMap.set(application.status, 1);
    }
  });

  this.statusStats = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));
}
  // Show bar chart
  showBarChart(): void {
    this.activeChart = 'bar';
  }

  // Show pie chart
  showPieChart(): void {
    this.activeChart = 'pie';
  }
 // Méthode pour obtenir l'angle de rotation
getRotationAngle(index: number): number {
  let total = 0;
  for (let i = 0; i < index; i++) {
    total += (this.statusStats[i].count / this.getTotalCount()) * 360;
  }
  return total;
}

// Méthode pour obtenir l'angle d'inclinaison (skewY)
getSkewAngle(index: number): number {
  const totalCount = this.getTotalCount();
  const percentage = (this.statusStats[index].count / totalCount) * 100;
  return percentage > 50 ? 45 : 0; // Ajuster l'angle pour les tranches > 50%
}

// Méthode pour obtenir la couleur d'une tranche
getColor(index: number): string {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; // Palette de couleurs
  return colors[index % colors.length];
}

// Méthode pour obtenir le nombre total de statuts
getTotalCount(): number {
  return this.statusStats.reduce((total, stat) => total + stat.count, 0);
}
// Get maximum count for bar chart
getMaxCount(): number {
  return Math.max(...this.statusStats.map(stat => stat.count));
}

  // Méthodes existantes
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
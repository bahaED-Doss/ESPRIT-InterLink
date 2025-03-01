import { Component, OnInit } from '@angular/core';
import { InternshipService } from '../../../services/internship.service';
import { Internship } from '../../../models/Internship.model';
import { PaginatePipe, PaginationControlsComponent } from 'ngx-pagination';
import { AsideComponent } from "../aside/aside.component";
import { NavBackComponent } from "../nav-back/nav-back.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-internships-back',
  templateUrl: './internships-back.component.html',
  styleUrls: ['./internships-back.component.css'],
  standalone: true,

  imports: [AsideComponent, NavBackComponent,CommonModule,FormsModule,RouterModule,NgxPaginationModule],
})
export class InternshipsBackComponent implements OnInit {
  internships: Internship[] = [];
  filteredInternships: Internship[] = [];
  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private internshipService: InternshipService) {}

  ngOnInit(): void {
    this.getAllInternships();
  }

  getAllInternships(): void {
    this.internshipService.getInternships().subscribe((data: Internship[]) => {
      this.internships = data;
      this.filteredInternships = data; // Initialiser les données filtrées
    });
  }

  applyFilter(): void {
    this.filteredInternships = this.internships.filter(internship =>
      internship.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      internship.companyName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      internship.localisation.toLowerCase().includes(this.searchText.toLowerCase())
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

    this.filteredInternships.sort((a, b) => {
      const valueA = a[column as keyof Internship];
      const valueB = b[column as keyof Internship];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? '▲' : '▼';
    }
    return '';
  }

  // Méthodes existantes
  viewDetails(internship: any) {
    console.log("Affichage des détails :", internship);
  }

  editInternship(internship: any) {
    console.log("Modification de l'internship :", internship);
  }

  deleteInternship(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce stage ?')) {
      this.internshipService.deleteInternship(id).subscribe(() => {
        this.getAllInternships();
      });
    }
  }
}
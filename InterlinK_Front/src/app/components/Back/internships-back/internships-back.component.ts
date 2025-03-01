import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InternshipService } from '../../../services/internship.service';
import { Internship, InternshipDuration, InternshipType, RequiredSkill } from '../../../models/Internship.model';
import { PaginatePipe, PaginationControlsComponent } from 'ngx-pagination';
import { AsideComponent } from "../aside/aside.component";
import { NavBackComponent } from "../nav-back/nav-back.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-internships-back',
  templateUrl: './internships-back.component.html',
  styleUrls: ['./internships-back.component.css'],
  standalone: true,
  imports: [
    AsideComponent,
    NavBackComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    ReactiveFormsModule, // Added ReactiveFormsModule
  ],
  providers: [InternshipService], // Provided InternshipService
})
export class InternshipsBackComponent implements OnInit {
  internships: Internship[] = [];
  filteredInternships: Internship[] = [];
  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  InternshipDuration = InternshipDuration;
  InternshipType = InternshipType;
  RequiredSkill = RequiredSkill;

  // Vos autres propriétés
  addInternshipForm: FormGroup;
  editInternshipForm: FormGroup;

  @ViewChild('addInternshipModal', { read: TemplateRef }) addInternshipModal!: TemplateRef<any>;
  @ViewChild('editInternshipModal', { read: TemplateRef }) editInternshipModal!: TemplateRef<any>;

  skillStats: { skill: string, count: number }[] = [];
  colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  constructor(
    private internshipService: InternshipService,
    private fb: FormBuilder,
    public modalService: NgbModal
  ) {
    this.addInternshipForm = this.fb.group({
      title: ['', Validators.required],
      companyName: ['', Validators.required],
      localisation: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      duration: ['', Validators.required], // Utilisez l'enum pour la durée
      type: ['', Validators.required],    // Utilisez l'enum pour le type
      skill: ['', Validators.required],   // Utilisez l'enum pour les compétences
      description: ['', Validators.required],
      availableSpots: ['', Validators.required],
    });

    this.editInternshipForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      companyName: ['', Validators.required],
      localisation: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      duration: ['', Validators.required],
      type: ['', Validators.required],
      skill: ['', Validators.required],
      description: ['', Validators.required],
      availableSpots: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllInternships();
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

  getAllInternships(): void {
    this.internshipService.getInternships().subscribe((data: Internship[]) => {
      this.internships = data;
      this.filteredInternships = data;
      this.calculateSkillStats(); // Calculate skill stats after loading data
    });
  }

  openAddInternshipModal(): void {
    this.modalService.open(this.addInternshipModal);
  }

  onSubmitAddInternship(): void {
    if (this.addInternshipForm.invalid) return;
    const internshipData = this.addInternshipForm.value;
    this.internshipService.addInternship(internshipData).subscribe(() => {
      this.modalService.dismissAll();
      this.addInternshipForm.reset();
      this.getAllInternships();
    });
  }

  openEditInternshipModal(internship: Internship): void {
    this.editInternshipForm.patchValue(internship);
    this.modalService.open(this.editInternshipModal);
  }

  onSubmitEditInternship(): void {
    if (this.editInternshipForm.invalid) return;
    const internshipData = this.editInternshipForm.value;
    this.internshipService.updateInternship(internshipData.id, internshipData).subscribe(() => {
      this.modalService.dismissAll();
      this.getAllInternships();
    });
  }
  deleteInternship(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce stage ?')) {
      this.internshipService.deleteInternship(id).subscribe({
        next: () => {
          // Rafraîchir la liste des stages après la suppression
          this.getAllInternships();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du stage :', err);
        },
      });
    }
  }

  calculateSkillStats(): void {
    const skillMap = new Map<string, number>();

    this.internships.forEach(internship => {
      if (skillMap.has(internship.skill)) {
        skillMap.set(internship.skill, skillMap.get(internship.skill)! + 1);
      } else {
        skillMap.set(internship.skill, 1);
      }
    });

    this.skillStats = Array.from(skillMap.entries()).map(([skill, count]) => ({ skill, count }));
  }

  getRotationAngle(index: number): number {
    let total = 0;
    for (let i = 0; i < index; i++) {
      total += (this.skillStats[i].count / this.getTotalCount()) * 360;
    }
    return total;
  }

  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getTotalCount(): number {
    return this.skillStats.reduce((total, stat) => total + stat.count, 0);
  }

  getMaxCount(): number {
    return Math.max(...this.skillStats.map(stat => stat.count));
  }

  applyFilter(): void {
    this.filteredInternships = this.internships.filter(internship =>
      internship.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      internship.companyName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      internship.localisation.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.currentPage = 1;
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
}
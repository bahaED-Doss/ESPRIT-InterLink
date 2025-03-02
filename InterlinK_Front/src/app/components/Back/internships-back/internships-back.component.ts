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
    ReactiveFormsModule,
  ],
  providers: [InternshipService],
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

  // Form groups for adding and editing internships
  addInternshipForm: FormGroup;
  editInternshipForm: FormGroup;

  // Template references for modals
  @ViewChild('addInternshipModal', { read: TemplateRef }) addInternshipModal!: TemplateRef<any>;
  @ViewChild('editInternshipModal', { read: TemplateRef }) editInternshipModal!: TemplateRef<any>;

  // Statistics data
  skillStats: { skill: string, count: number }[] = [];
  colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  // Active chart type
  activeChart: 'bar' | 'pie' | null = null;

  constructor(
    private internshipService: InternshipService,
    private fb: FormBuilder,
    public modalService: NgbModal
  ) {
    // Initialize the add internship form
    this.addInternshipForm = this.fb.group({
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

    // Initialize the edit internship form
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

  // Method to get enum values
  getEnumValues(enumObject: any): string[] {
    return Object.values(enumObject);
  }

  // Method to format enum values
  formatEnumValue(value: string): string {
    return value
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Fetch all internships
  getAllInternships(): void {
    this.internshipService.getInternships().subscribe((data: Internship[]) => {
      this.internships = data;
      this.filteredInternships = data;
      this.calculateSkillStats(); // Calculate skill stats after loading data
    });
  }

  // Open the add internship modal
  openAddInternshipModal(): void {
    this.modalService.open(this.addInternshipModal);
  }

  // Submit the add internship form
  onSubmitAddInternship(): void {
    if (this.addInternshipForm.invalid) return;
    const internshipData = this.addInternshipForm.value;
    this.internshipService.addInternship(internshipData).subscribe(() => {
      this.modalService.dismissAll();
      this.addInternshipForm.reset();
      this.getAllInternships();
    });
  }

  // Open the edit internship modal
  openEditInternshipModal(internship: Internship): void {
    this.editInternshipForm.patchValue(internship);
    this.modalService.open(this.editInternshipModal);
  }

  // Submit the edit internship form
  onSubmitEditInternship(): void {
    if (this.editInternshipForm.invalid) return;
    const internshipData = this.editInternshipForm.value;
    this.internshipService.updateInternship(internshipData.id, internshipData).subscribe(() => {
      this.modalService.dismissAll();
      this.getAllInternships();
    });
  }
  deleteInternship(id: number): void {
    console.log('Deleting internship with ID:', id); // Ajoutez ce log
    if (confirm('Are you sure you want to delete this internship?')) {
      this.internshipService.deleteInternship(id).subscribe({
        next: () => {
          this.getAllInternships();
        },
        error: (err) => {
          console.error('Error deleting internship:', err);
        },
      });
    }
  }

  // Calculate skill statistics
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
    total += (this.skillStats[i].count / this.getTotalCount()) * 360;
  }
  return total;
}

// Méthode pour obtenir l'angle d'inclinaison (skewY)
getSkewAngle(index: number): number {
  const totalCount = this.getTotalCount();
  const percentage = (this.skillStats[index].count / totalCount) * 100;
  return percentage > 50 ? 45 : 0; // Ajuster l'angle pour les tranches > 50%
}

// Méthode pour obtenir la couleur d'une tranche
getColor(index: number): string {
  const colors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF']; // Palette de couleurs
  return colors[index % colors.length];
}

// Méthode pour obtenir le nombre total de stages
getTotalCount(): number {
  return this.skillStats.reduce((total, stat) => total + stat.count, 0);
}


  // Get maximum count for bar chart
  getMaxCount(): number {
    return Math.max(...this.skillStats.map(stat => stat.count));
  }

  // Apply search filter
  applyFilter(): void {
    this.filteredInternships = this.internships.filter(internship =>
      internship.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      internship.companyName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      internship.localisation.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.currentPage = 1;
  }

  // Sort data by column
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

  // Get sort icon for column
  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? '▲' : '▼';
    }
    return '';
  }
}
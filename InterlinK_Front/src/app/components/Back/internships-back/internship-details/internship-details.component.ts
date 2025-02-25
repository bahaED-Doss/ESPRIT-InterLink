import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from '../../../../services/internship.service';
import { Internship } from '../../../../models/Internship.model';


@Component({
  selector: 'app-internship-details',
  templateUrl: './internship-details.component.html',
  styleUrls: ['./internship-details.component.css']
})
export class InternshipDetailsComponent implements OnInit {
  internship: Internship | undefined;
  internshipId: number | null | undefined;

  constructor(
    private internshipService: InternshipService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID récupéré:', id); // Vérifie si l'ID est correct
    if (!isNaN(id)) {
      this.loadInternshipDetails(id);
    } else {
      console.error('ID non valide');
    }}
  loadInternshipDetails(id: number): void {
    this.internshipService.getInternshipById(id).subscribe({
      next: (data) => {
        this.internship = data; // Stocker les données récupérées
        console.log('Détails du stage:', this.internship);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du stage:', error);
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/internships']);
  }
}

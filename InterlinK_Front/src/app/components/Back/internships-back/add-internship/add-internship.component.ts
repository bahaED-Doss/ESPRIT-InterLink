import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InternshipService } from '../../../../services/internship.service';
import { Internship, InternshipDuration, InternshipType, RequiredSkill } from '../../../../models/Internship.model';

@Component({
  selector: 'app-add-internship',
  templateUrl: './add-internship.component.html',
  styleUrls: ['./add-internship.component.css']
})
export class AddInternshipComponent implements OnInit {
  internship: Internship = {
    title: '',
    companyName: '',
    localisation: '',
    startDate: new Date(),
    endDate: new Date(),
    availableSpots: 0,
    internshipId: 0,
    description: '',
    duration: InternshipDuration.FOUR_WEEKS,
    type: InternshipType.FULL_TIME,
    skill: RequiredSkill.GENIELOGICIEL
  };

  message: { text: string, type: string } | null = null; // Message d'alerte

  constructor(
    private internshipService: InternshipService,
    private router: Router // Injection de Router pour la navigation
  ) {}
  ngOnInit(): void {}

  onSubmit(): void {
    this.internshipService.addInternship(this.internship).subscribe(
      (data) => {
        this.message = { text: 'Stage ajouté avec succès!', type: 'success' };
        setTimeout(() => {
          this.router.navigate(['/internships-back']); // Redirection vers la page des stages
        }, 2000); // Attendre 2 secondes avant de rediriger
      },
      (error) => {
        this.message = { text: 'Erreur lors de l\'ajout du stage. Veuillez réessayer.', type: 'error' };
      }
    );
  }

   goBack(): void {
    this.router.navigate(['/internships-back']); // Redirection vers la page des stages
  }
}

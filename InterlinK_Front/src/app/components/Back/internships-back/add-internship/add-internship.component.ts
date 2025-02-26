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
  errors: { [key: string]: string } = {}; // Stockage des erreurs pour chaque champ

  constructor(
    private internshipService: InternshipService,
    private router: Router // Injection de Router pour la navigation
  ) {}
  ngOnInit(): void {}

  
  validateForm(): boolean {
    this.errors = {}; // Réinitialiser les erreurs

    // Validation de companyName et localisation : pas de chiffres
    const textPattern = /^[A-Za-z\s]*$/; // Autorise uniquement les lettres et les espaces
    if (!textPattern.test(this.internship.companyName)) {
      this.errors['companyName'] = 'Le nom de l\'entreprise ne doit pas contenir de chiffres.';
    }
  if (!textPattern.test(this.internship.title)) {
      this.errors['title'] = 'Le titre de stage ne doit pas contenir de chiffres.';
    }

    if (!textPattern.test(this.internship.localisation)) {
      this.errors['localisation'] = 'La localisation ne doit pas contenir de chiffres.';
    }

    // Validation des dates : la date de début et la date de fin doivent être après aujourd'hui
    const today = new Date();
    if (this.internship.startDate <= today) {
      this.errors['startDate'] = 'La date de début doit être après la date d\'aujourd\'hui.';
    }

    if (this.internship.endDate <= today || this.internship.endDate <= this.internship.startDate) {
      this.errors['endDate'] = 'La date de fin doit être après la date de début et après aujourd\'hui.';
    }

    // Validation des champs obligatoires
    if (!this.internship.title || !this.internship.description || this.internship.availableSpots <= 0) {
      this.errors['requiredFields'] = 'Tous les champs obligatoires doivent être remplis correctement.';
    }

    // Vérification des valeurs des enums
    if (!Object.values(InternshipDuration).includes(this.internship.duration)) {
      this.errors['duration'] = 'Durée du stage invalide.';
    }
  
    if (!Object.values(InternshipType).includes(this.internship.type)) {
      this.errors['type'] = 'Type de stage invalide.';
    }
  
    if (!Object.values(RequiredSkill).includes(this.internship.skill)) {
      this.errors['skill'] = 'Compétence requise invalide.';
    }

    return Object.keys(this.errors).length === 0; // Si aucune erreur, retourner true
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return; // Ne pas soumettre si des erreurs existent
    }

    // Appel au service pour ajouter le stage
    this.internshipService.addInternship(this.internship).subscribe(
      (data) => {
        this.message = { text: 'Stage ajouté avec succès!', type: 'success' };
        setTimeout(() => {
          this.router.navigate(['/internships-back']);
        }, 2000);
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

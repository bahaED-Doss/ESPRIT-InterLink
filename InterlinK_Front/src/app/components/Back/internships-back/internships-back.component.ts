import { Component, OnInit } from '@angular/core';
import { InternshipService } from '../../../services/internship.service';
import { Internship } from '../../../models/Internship.model';
import { SettingsComponent } from "../settings/settings.component";
import { FooterBackComponent } from "../footer-back/footer-back.component";
import { AsideComponent } from "../aside/aside.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavBackComponent } from "../nav-back/nav-back.component";
@Component({
  selector: 'app-internships-back',
  templateUrl: './internships-back.component.html',
  styleUrls: ['./internships-back.component.css'],
  standalone: true,
  imports: [SettingsComponent, FooterBackComponent, AsideComponent, CommonModule, RouterModule, NavBackComponent]

})
export class InternshipsBackComponent implements OnInit {
  internships: Internship[] = [];

  constructor(private internshipService: InternshipService) {}

  ngOnInit(): void {
    this.getAllInternships();
  }
  openAddModal() {
    console.log("Ouverture du modal d'ajout");
    // Ajoute ici la logique pour ouvrir un modal
  }
  getAllInternships(): void {
    this.internshipService.getInternships().subscribe((data: Internship[]) => {
      this.internships = data;
    });
  }
  viewDetails(internship: any) {
    console.log("Affichage des détails :", internship);
    // Ajoute ici la logique pour afficher les détails
  }

  editInternship(internship: any) {
    console.log("Modification de l'internship :", internship);
    // Ajoute ici la logique pour modifier un internship
  }
  addInternship(newInternship: Internship): void {
    this.internshipService.addInternship(newInternship).subscribe(() => {
      this.getAllInternships(); // Rafraîchir la liste après ajout
    });
  }

  deleteInternship(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce stage ?')) {
      this.internshipService.deleteInternship(id).subscribe(() => {
        this.getAllInternships();
      });
    }
  }
}

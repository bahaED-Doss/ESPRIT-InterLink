import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/app/services/interview.service';
import { Interview } from '../../../models/Interview';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
})
export class InterviewComponent implements OnInit {
  public data: any = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 2;

  private searchSubject: Subject<string> = new Subject();
  private subscription: Subscription = new Subscription();

  questionIdSelectionne: number = 0;
  constructor(
    private interviewService: InterviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInterviews();

    this.subscription.add(
      this.searchSubject
        .pipe(
          debounceTime(300), // Attend 300 ms après la dernière frappe
          distinctUntilChanged() // Évite les appels multiples avec la même valeur
        )
        .subscribe((searchText) => {
          this.searchInterview(searchText);
        })
    );
  }

  // Charger tous les entretiens
  loadInterviews(): void {
    this.subscription.add(
      this.interviewService.getInterviews().subscribe({
        next: (res: any) => {
          this.data = res;
          console.log('Data', this.data);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des tests:', err);
        },
      })
    );
  }

  onSearch(searchText: string): void {
    this.searchSubject.next(searchText);
  }

  searchInterview(searchText: string): void {
    if (!searchText) {
      this.loadInterviews();
      return;
    }
    this.subscription.add(
      this.interviewService.searchInterview(searchText).subscribe({
        next: (res: any) => {
          this.data = res;
          console.log('Résultats de la recherche', this.data);
        },
        error: (err) => {
          console.error('Erreur lors de la recherche des tests:', err);
        },
      })
    );
  }

  addInterview(): void {
    this.router.navigate(['/inteview/add']);
  }

  ouvrirFormulaireEditInterview(interviwId: number): void {
    this.router.navigate(['/inteview/edit', interviwId]);
  }

  supprimerInterview(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.interviewService.deleteInterview(id).subscribe(
          () => {
            // Supprimer l'élément du tableau
            this.data = this.data.filter(
              (inteview: any) => inteview.interviewId !== id
            );

            // Vérifier si la page actuelle est vide après suppression
            const totalItems = this.data.length;
            const totalPages = Math.ceil(totalItems / this.itemsPerPage);

            if (this.currentPage > totalPages) {
              this.currentPage = totalPages || 1; // Revenir à la dernière page existante
            }

            Swal.fire('Supprimé !', 'Le Interview a été supprimé.', 'success');
          },
          (error) => {
            console.error('Erreur lors de la suppression', error);
            Swal.fire(
              'Erreur',
              'Impossible de supprimer ce Interview.',
              'error'
            );
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

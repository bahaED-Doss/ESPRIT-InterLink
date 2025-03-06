import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TestService } from 'src/app/services/test.service';
import * as bootstrap from 'bootstrap';
import { Question } from 'src/app/models/question';
import { QuestionService } from 'src/app/services/question.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-test',
  templateUrl: './list-test.component.html',
  styleUrls: ['./list-test.component.css'],
})
export class ListTestComponent implements OnInit, OnDestroy {
  public data: any = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 2;

  nouvelleQuestion: any = { contenu: '', testId: null };
  testIdSelectionne: number = 0;

  private searchSubject: Subject<string> = new Subject();
  private subscription: Subscription = new Subscription();

  constructor(
    private testService: TestService,
    private router: Router,
    private modalService: NgbModal,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.fetchAllTest();

    this.subscription.add(
      this.searchSubject
        .pipe(
          debounceTime(300), // Attend 300 ms après la dernière frappe
          distinctUntilChanged() // Évite les appels multiples avec la même valeur
        )
        .subscribe((searchText) => {
          this.searchTests(searchText);
        })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Méthode appelée lors de la saisie dans l'input
  onSearch(searchText: string): void {
    this.searchSubject.next(searchText);
  }

  // Recherche des tests via le backend
  searchTests(searchText: string): void {
    if (!searchText) {
      this.fetchAllTest();
      return;
    }
    this.subscription.add(
      this.testService.searchTests(searchText).subscribe({
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

  fetchAllTest() {
    this.subscription.add(
      this.testService.getAll().subscribe({
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

  addTest(): void {
    this.router.navigate(['/test/add']);
  }

  ouvrirFormulaireEditTest(testId: number): void {
    this.router.navigate(['/test/edit', testId]);
  }

  openQuestionModal(testId: number) {
    this.testIdSelectionne = testId;
    this.nouvelleQuestion = { contenu: '', testId: testId, noteAttribuee: '' };
    const modalElement = document.getElementById('questionModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  ajouterQuestion() {
    if (!this.nouvelleQuestion.contenu.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Une erreur est survenue lors de l’ajout de la question.',
        icon: 'error', // Icône pour succès : success, error, warning, info, question
        confirmButtonText: 'OK',
      });
      return;
    }

    // Appel au service pour ajouter la question
    this.questionService.add(this.nouvelleQuestion).subscribe(
      (response: Question) => {
        console.log('Question ajoutée avec succès', response);
        this.fetchAllTest();
        this.nouvelleQuestion = { contenu: '', testId: null };
        Swal.fire({
          title: 'Success!',
          text: 'The Question has been added successfully.',
          icon: 'success', // Icône pour succès : success, error, warning, info, question
          confirmButtonText: 'OK',
        });
      },
      (error) => {
        console.error('Erreur lors de l’ajout de la question', error);
        Swal.fire({
          title: 'Error!',
          text: 'Une erreur est survenue lors de l’ajout de la question.',
          icon: 'error', // Icône pour succès : success, error, warning, info, question
          confirmButtonText: 'OK',
        });
      }
    );
  }

  supprimerTest(id: number) {
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
        this.testService.delete(id).subscribe(
          () => {
            // Supprimer l'élément du tableau
            this.data = this.data.filter((test: any) => test.testId !== id);

            // Vérifier si la page actuelle est vide après suppression
            const totalItems = this.data.length;
            const totalPages = Math.ceil(totalItems / this.itemsPerPage);

            if (this.currentPage > totalPages) {
              this.currentPage = totalPages || 1; // Revenir à la dernière page existante
            }

            Swal.fire('Supprimé !', 'Le test a été supprimé.', 'success');
          },
          (error) => {
            console.error('Erreur lors de la suppression', error);
            Swal.fire('Erreur', 'Impossible de supprimer ce test.', 'error');
          }
        );
      }
    });
  }
}

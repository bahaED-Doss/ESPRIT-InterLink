import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css'],
})
export class ListQuestionBackComponent {
  public data: any = [];
  idParam: any;
  public currentPage: number = 1;
  public itemsPerPage: number = 2;
  questionIdSelectionne: number = 0;
  private subscription: Subscription = new Subscription();
  nouvelleQuestion: any = {};

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idParam = this.route.snapshot.paramMap.get('id');
    this.fetchAllQuestion();
  }

  fetchAllQuestion() {
    this.subscription.add(
      this.questionService.getAllByTest(this.idParam).subscribe({
        next: (res: any) => {
          this.data = res;
          console.log('Data', this.data);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des question:', err);
        },
      })
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
        this.questionService.delete(id).subscribe(
          () => {
            // Supprimer l'élément du tableau
            this.data = this.data.filter(
              (question: any) => question.questionId !== id
            );

            // Vérifier si la page actuelle est vide après suppression
            const totalItems = this.data.length;
            const totalPages = Math.ceil(totalItems / this.itemsPerPage);

            if (this.currentPage > totalPages) {
              this.currentPage = totalPages || 1; // Revenir à la dernière page existante
            }

            Swal.fire('Supprimé !', 'Le Question a été supprimé.', 'success');
          },
          (error) => {
            console.error('Erreur lors de la suppression', error);
            Swal.fire(
              'Erreur',
              'Impossible de supprimer ce Question.',
              'error'
            );
          }
        );
      }
    });
  }

  openQuestionModal(questionId: number) {
    this.questionIdSelectionne = questionId;
    const question = this.data.find((q: any) => q.questionId === questionId);
    if (question) {
      this.nouvelleQuestion = { ...question };
    }

    const modalElement = document.getElementById('questionModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  modifierQuestion() {
    this.questionService
      .edit(this.questionIdSelectionne, this.nouvelleQuestion)
      .subscribe({
        next: (updated) => {
          // Mettre à jour localement la question dans le tableau data
          const index = this.data.findIndex(
            (q: any) => q.questionId === this.questionIdSelectionne
          );
          if (index !== -1) {
            this.data[index] = { ...updated };
          }

          const modalElement = document.getElementById('questionModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal?.hide();
          }

          Swal.fire(
            'Succès',
            'La question a été modifiée avec succès.',
            'success'
          );
        },
        error: (err) => {
          console.error('Erreur lors de la modification :', err);
          Swal.fire(
            'Erreur',
            'Une erreur est survenue lors de la modification.',
            'error'
          );
        },
      });
  }
}
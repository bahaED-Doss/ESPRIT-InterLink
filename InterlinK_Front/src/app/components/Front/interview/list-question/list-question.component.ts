import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { Interview } from 'src/app/models/Interview';
import { Reponse } from 'src/app/models/reponse';
import { Test } from 'src/app/models/test';
import { InterviewService } from 'src/app/services/interview.service';
import { QuestionService } from 'src/app/services/question.service';
import { ReponseService } from 'src/app/services/reponse.service';
import { TestService } from 'src/app/services/test.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css'],
})
export class ListQuestionComponent implements OnInit {
  public data: any = [];
  test!: Test;
  interview!: Interview;
  responses: Reponse[] = [];
  idParam: any;

  private subscription: Subscription = new Subscription();

  constructor(
    private QuestionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private ReponsService: ReponseService,
    private TestService: TestService
  ) {}

  ngOnInit(): void {
    this.idParam = this.route.snapshot.paramMap.get('id');
    forkJoin({
      test: this.TestService.getById(this.idParam),
      questions: this.QuestionService.getAllByTest(this.idParam),
    }).subscribe({
      next: (res) => {
        this.test = res.test; // Récupérer le test
        this.data = res.questions; // Récupérer les questions

        // Initialiser les réponses après avoir récupéré les questions
        this.responses = this.data.map(
          (question: any) => new Reponse(false, '', 1, question.questionId) // Associer l'ID de la question à chaque réponse
        );

        console.log('Test:', this.test);
        console.log('Questions:', this.data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des données:', err);
      },
    });
  }

  submitResponses(): void {
    this.ReponsService.add(this.responses, this.idParam).subscribe({
      next: (savedResponses) => {
        console.log('Saved:', savedResponses);

        // Affichage du message de succès avec SweetAlert2
        Swal.fire({
          title: 'Test Enregistré',
          text: 'Votre test a été enregistré avec succès!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirection vers la page "interview"
            this.router.navigate(['/viewinterview']);
          }
        });
      },
      error: (err) => {
        console.error('Error:', err);
        // Affichage d'un message d'erreur en cas d'échec
        Swal.fire({
          title: 'Erreur',
          text: "Il y a eu une erreur lors de l'enregistrement du test.",
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReponseService } from 'src/app/services/reponse.service';

@Component({
  selector: 'app-check-test',
  templateUrl: './check-test.component.html',
  styleUrls: ['./check-test.component.css'],
})
export class CheckTestComponent {
  private subscription: Subscription = new Subscription();

  public data: any = [];
  constructor(
    private ResponseService: ReponseService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.fetchAllRep();
  }

  fetchAllRep() {
    this.subscription.add(
      this.ResponseService.getAllByQuestion(
        1,
        this.route.snapshot.paramMap.get('id')
      ).subscribe({
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
}

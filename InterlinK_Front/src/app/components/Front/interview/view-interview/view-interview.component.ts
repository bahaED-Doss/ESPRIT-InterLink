import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InterviewService } from 'src/app/services/interview.service';

@Component({
  selector: 'app-view-interview',
  templateUrl: './view-interview.component.html',
  styleUrls: ['./view-interview.component.css'],
})
export class ViewInterviewComponent implements OnInit {
  public data: any = [];
  private subscription: Subscription = new Subscription();
  result: string = '';
  constructor(
    private router: Router,
    private interviewService: InterviewService
  ) {}
  ngOnInit(): void {
    this.fetchAllInterview();
  }

  fetchAllInterview() {
    this.subscription.add(
      this.interviewService.getInterviews().subscribe({
        next: (res: any) => {
          this.data = res;
          console.log('Data', this.data);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des Interview:', err);
        },
      })
    );
  }

  viewTest(id: number): void {
    this.router.navigate(['/viewinterview/', id]);
  }

  checkResult(id: number): void {
    this.router.navigate(['/checkresult/', id]);
  }

  getRankAndPercent(id: number): void {
    this.interviewService.getRankAndPercent(id).subscribe(
      (response: string) => {
        this.result = response; // Stocker la réponse dans la variable
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
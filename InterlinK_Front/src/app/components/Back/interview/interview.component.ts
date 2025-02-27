import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/app/services/interview.service';
import { Interview } from 'src/app/models/interview';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {
  interviews: any[] = [];
 newInterview: Interview = {
    studentId: 0,
    projectManagerId: 0,
    applicationId: 0,
    interviewDate: '',
    interviewType: '',
    statusType: '',
    lienReunion: ''
  };

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.interviewService.getInterviews().subscribe(data => {
      this.interviews = data;
    });
  }

  addInterview(): void {
    this.interviewService.addInterview(this.newInterview).subscribe(() => {
      this.loadInterviews();
      this.newInterview = {
        studentId: 0,
        projectManagerId: 0,
        applicationId: 0,
        interviewDate: '',
        interviewType: '',
        statusType: '',
        lienReunion: ''
      };
    });
  }

  deleteInterview(id: number): void {
    this.interviewService.deleteInterview(id).subscribe(() => {
      this.loadInterviews();
    });
  }
}

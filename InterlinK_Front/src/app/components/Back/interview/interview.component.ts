import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/app/services/interview.service';
import { Interview } from '../../../models/Interview.model';
@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {
  interviews: Interview[] = [];
  currentInterview: Interview = {
    studentId: 0, projectManagerId: 0, applicationId: 0,
    interviewDate: '', interviewType: '', statusType: '',
    lienReunion: ''
  };
  editing = false;

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.interviewService.getInterviews().subscribe((data) => {
      this.interviews = data;
    });
  }

  addInterview(): void {
    this.interviewService.addInterview(this.currentInterview).subscribe((interview) => {
      this.interviews.push(interview);
      this.resetForm();
    });
  }

  updateInterview(): void {
    this.interviewService.updateInterview(this.currentInterview).subscribe(() => {
      this.loadInterviews();
      this.resetForm();
    });
  }

  deleteInterview(interviewId: number | undefined): void {
    if (interviewId !== undefined) {
      this.interviewService.deleteInterview(interviewId).subscribe(() => {
        this.interviews = this.interviews.filter(i => i.interviewId !== interviewId);
      });
    }
  }

  editInterview(interview: Interview): void {
    this.currentInterview = { ...interview };
    this.editing = true;
  }

  resetForm(): void {
    this.currentInterview = {
      studentId: 0, projectManagerId: 0, applicationId: 0,
      interviewDate: '', interviewType: '', statusType: '',
      lienReunion: ''
    };
    this.editing = false;
  }
}

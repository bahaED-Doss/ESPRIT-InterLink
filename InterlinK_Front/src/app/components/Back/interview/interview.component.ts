import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/app/services/interview.service';
import { Interview } from '../../../models/Interview';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {
  interviews: Interview[] = [];
  editing: boolean = false;

  currentInterview: Interview = {
    studentId: 0,
    projectManagerId: 0,
    applicationId: 0,
    interviewDate: '',
    interviewType: '',
    statusType: '',
    lienReunion: '',
    interviewId: 0
  };

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  // Charger tous les entretiens
  loadInterviews(): void {
    this.interviewService.getInterviews().subscribe(data => {
      this.interviews = data;
    });
  }

  // Ajouter un entretien
  addInterview(): void {
    this.interviewService.addInterview(this.currentInterview).subscribe(interview => {
      this.interviews.push(interview);
      
      // Réinitialisation du formulaire après l'ajout
      this.currentInterview = {
        studentId: 0, 
        projectManagerId: 0, 
        applicationId: 0,
        interviewDate: '', 
        interviewType: '', 
        statusType: '',
        lienReunion: '', 
        interviewId: 0
      };
  
      this.editing = false; // Sortir du mode édition si actif
    });
  }
  

  // Supprimer un entretien
  deleteInterview(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet entretien ?')) {
      this.interviewService.deleteInterview(id).subscribe(() => {
        this.interviews = this.interviews.filter(interview => interview.interviewId !== id);
      });
    }
  }

  // Modifier un entretien
  editInterview(interview: Interview): void {
    this.currentInterview = { ...interview }; // Copie de l'entretien sélectionné
    this.editing = true;
  }

  // Mettre à jour un entretien
 
  updateInterview(): void {
    this.interviewService.updateInterview(this.currentInterview).subscribe(updatedInterview => {
      this.interviews = this.interviews.map(interview =>
        interview.interviewId === updatedInterview.interviewId ? updatedInterview : interview
      );
      this.currentInterview = { // Réinitialisation après modification
        studentId: 0, projectManagerId: 0, applicationId: 0,
        interviewDate: '', interviewType: '', statusType: '',
        lienReunion: '', interviewId: 0
      };
      this.editing = false;
    });
  }
  

}

import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { InterviewService } from 'src/app/services/interview.service';
import { Interview } from 'src/app/models/Interview';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [], // Initialement vide, sera mis à jour après la récupération des données
  };

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.interviewService.getInterviews().subscribe((interviews) => {
      this.calendarOptions.events = interviews.map((interview: Interview) => ({
        title: interview.titre,
        date: interview.interviewDate, // Assurez-vous que la date est dans le format attendu
      }));
    });
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent {
  @Input() internshipTitle: string | undefined;
  @Output() formSubmitted = new EventEmitter<any>(); // Émet un événement lorsque le formulaire est soumis

  application = {
    studentName: '',
    email: '',
    cv: null
  };

  onFileSelected(event: any) {
    this.application.cv = event.target.files[0];
  }

  submitApplication() {
    // Émet le formulaire soumis
    this.formSubmitted.emit(this.application);
    // Réinitialiser le formulaire après la soumission
    this.application = {
      studentName: '',
      email: '',
      cv: null
    };
  }
}
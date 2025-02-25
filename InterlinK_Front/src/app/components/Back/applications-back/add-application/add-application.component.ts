import { Component } from '@angular/core';
import { ApplicationService } from '../../../../services/application.service';
import { Application, ApplicationStatus } from '..//../../../models/Application.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html'
})
export class AddApplicationComponent {
  application: Application = {
    applicationId: 0,
    status: ApplicationStatus.PENDING,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    cv: '',
    internshipId: 0
  };

  constructor(private applicationService: ApplicationService, private router: Router) {}

  onSubmit() {
    this.applicationService.createApplication(this.application).subscribe(() => {
      this.router.navigate(['/applications']); // Rediriger vers la liste des applications après ajout
    });
  }
}

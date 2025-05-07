import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EducationService } from 'src/app/services/UserS/education.service';
import { AuthService } from 'src/app/services/UserS/auth.service';
import { Education } from 'src/app/models/education';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {
  userId!: number;
  educations: any[] = [];
  newEducation: any = {
    school: '',
    educationLevel: '',
    currentlyAttending: false,
    startDate: '',
    endDate: '',
    areaOfStudy: '',
    description: ''
  };

  private modalRef!: NgbModalRef;

  @ViewChild('addEducationModal') addEducationModal!: TemplateRef<any>;
  @ViewChild('firstInput') firstInput!: any; // Reference to first input in modal

  constructor(
    private modalService: NgbModal,
    private educationService: EducationService
  ) {}

  ngOnInit(): void {
    // Assume userId is set from route or service
    this.userId = 39; // Example
    this.getEducations();
  }

  getEducations(): void {
    this.educationService.getEducationsByUserId(this.userId).subscribe((educations) => {
      this.educations = educations;
    });
  }

  openAddEducationModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.open(template, { size: 'lg', backdrop: 'static', keyboard: false });
    // Wait a bit for the modal to open, then set focus on the first input element
    setTimeout(() => {
      if (this.firstInput && this.firstInput.nativeElement) {
        this.firstInput.nativeElement.focus();
      }
    }, 100);
  }

  saveEducation(modal: NgbModalRef): void {
    this.educationService.addEducation(this.userId, this.newEducation).subscribe(
      (savedEducation) => {
        this.getEducations();
        modal.close();
        // Optionally, reset newEducation object
        this.newEducation = {
          school: '',
          educationLevel: '',
          currentlyAttending: false,
          startDate: '',
          endDate: '',
          areaOfStudy: '',
          description: ''
        };
      },
      (error) => {
        console.error('Error saving education:', error);
        alert('Error saving education');
      }
    );
  }
  // For future: update or delete an education, if needed
  // ...
}

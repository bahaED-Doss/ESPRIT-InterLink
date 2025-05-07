import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentService } from 'src/app/services/UserS/document.service';
import { AuthService } from 'src/app/services/UserS/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  userId!: number; // The user ID from the route
  user: any;     
  userForm: FormGroup;  // If needed for further user data
  selectedDocumentType: string = 'stageRequest'; // default selection
  downloadUrl: string | null = null;

  // Form data for Lettre d’affectation (Company details)
  letterForm = {
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    stageStartDate: '',
    stagePeriod: '',  // Start date for the stage
    stageEndDate: '',    // End date for the stage
    className: ''
  };

  // This property will store the full name of the connected user.
  studentFullName: string = '';
  studentClass: string = '';
  journalForm = {
    date: '',
    tasks: ''
  };
  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // If you plan to use userForm for user data update, you can initialize it here.
    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: ['']
      // ...other controls as needed
    });
  }

  ngOnInit(): void {
    // Get user ID from route parameters
    this.userId = +this.route.snapshot.params['id'];
    console.log("Logged-in user ID:", this.userId);

    // Fetch user data
    this.authService.getUserById(this.userId).subscribe((userData) => {
      this.user = userData; // Save the complete user object
      // Optionally, populate the form if you are using it for editing user info:
      this.userForm.patchValue(userData);

      // Set the studentFullName from the fetched user's firstName and lastName
      this.studentFullName = `${this.user.firstName} ${this.user.lastName}`;
      this.studentClass = this.user.levelOfStudy;
      console.log("Connected student's full name:", this.studentFullName);
      console.log("Student class (level of study):", this.studentClass);
    }, error => {
      console.error('Error fetching user data', error);
    });
  }

  generateDocument(): void {
    if (this.selectedDocumentType === 'letterOfAssignment') {
      // Generate Lettre d’affectation using the additional form details
      this.documentService.generateLetterOfAssignment({
        studentFullName: this.studentFullName,
        className: this.letterForm.className,
        companyName: this.letterForm.companyName,
        companyAddress: this.letterForm.companyAddress,
        companyEmail: this.letterForm.companyEmail,
        companyPhone: this.letterForm.companyPhone,
        stagePeriod: this.letterForm.stagePeriod,
        stageStartDate: this.letterForm.stageStartDate,  // Get the start date from the form
        stageEndDate: this.letterForm.stageEndDate     // Get the end date from the form
      }).subscribe(blob => {
        this.downloadUrl = URL.createObjectURL(blob);
      }, error => {
        console.error('Error generating letter of assignment', error);
      });
    } else if (this.selectedDocumentType === 'journalDeStage' ){

    }
     else {
      // For default documents (Demande de Stage, Journal de Stage)
      this.documentService.generateDefaultDocument(this.selectedDocumentType, this.studentFullName, this.studentClass)
        .subscribe(blob => {
          this.downloadUrl = URL.createObjectURL(blob);
        }, error => {
          console.error('Error generating document', error);
        });
    }
  }
}

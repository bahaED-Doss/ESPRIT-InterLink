import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/UserS/auth.service';

@Component({
  selector: 'app-documentss-st',
  templateUrl: './documentss-st.component.html',
  styleUrls: ['./documentss-st.component.css']
})
export class DocumentssSTComponent implements OnInit {

  userId!: number;
  user: User | any;
  documentsForm: FormGroup;
  uploadedFiles: File[] = [];
  private backendUrl = 'http://localhost:8081';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.documentsForm = this.fb.group({
      documents: ['']  // Initialize a control for the form
    });
    // Build the form for social links with validators
   
  }
  

  

  

  // Handle file change (multiple files can be selected)
  onFileChange(event: any): void {
    const files = event.target.files;
    if (files) {
      // Add selected files to the uploadedFiles array
      for (let i = 0; i < files.length; i++) {
        this.uploadedFiles.push(files[i]);
      }
    }
  }

  // Submit the form
  onSubmit(): void {
    if (this.documentsForm.invalid) {
      return;
    }

    // Logic to upload the documents
    const formData = new FormData();
    this.uploadedFiles.forEach(file => {
      formData.append('documents', file, file.name);
    });

    // Call your service to handle file upload to backend (e.g., file upload API)
    this.http.post('http://localhost:8081/api/documents/upload', formData).subscribe(
      (response) => {
        console.log('Files uploaded successfully!', response);
      },
      (error) => {
        console.error('Error uploading files', error);
      }
    );
  }

  // Delete a document from the uploaded files list
  deleteDocument(file: File): void {
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }
  ngOnInit(): void {
    // Get user ID from route parameters (or from localStorage if needed)
    this.userId = Number(this.route.snapshot.params['id'] || localStorage.getItem('userId'));
    console.log("Logged-in user ID:", this.userId);
    this.authService.getUserById(this.userId).subscribe((userData: User) => {
      this.user = userData;
      // Patch the form with the current social links
      
    });
  }
}

import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
@Component({
  selector: 'app-profile-student',
  templateUrl: './profile-student.component.html',
  styleUrls: ['./profile-student.component.css']
})
export class ProfileStudentComponent implements OnInit {
  userForm: FormGroup;
  userId!: number; // We'll keep the userId as a string
  user: any;     // This will hold the full user object
  private backendUrl = 'http://localhost:8081';
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, this.alphaOnlyValidator()]],
      lastName: ['', [Validators.required, this.alphaOnlyValidator()]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, this.exactDigitsValidator(8)]],
      levelOfStudy: ['', Validators.required],
      
    });
  }
  alphaOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && !/^[A-Za-z]+$/.test(value)) {
        return { alphaOnly: true };
      }
      return null;
    };
  }
  exactDigitsValidator(n: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const regex = new RegExp(`^\\d{${n}}$`);
      return regex.test(value) ? null : { exactDigits: { requiredDigits: n, actualLength: value ? value.length : 0 } };
    };
  }

  // Custom validator to ensure the email ends with @esprit.tn
  espritEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const pattern = /^[a-zA-Z0-9._%+-]+@esprit\.tn$/;
      return pattern.test(value) ? null : { espritEmail: true };
    };
  }

  ngOnInit(): void {
    // Get user ID from route parameters (as a string)
    this.userId = this.route.snapshot.params['id'];
    console.log("Logged-in user ID:", this.userId);

    // Fetch user data and populate both the local user variable and the form
    this.authService.getUserById(this.userId).subscribe((userData) => {
      this.user = userData; // Save the complete user object
      this.userForm.patchValue(userData); // Fill the form with user data
    });
  }

  // Handle file selection for the new profile picture
  // Returns the full URL for the profile photo
  getPhotoUrl(): string {
    if (!this.user || !this.user.photoUrl) {
      return 'https://bootdey.com/img/Content/avatar/avatar1.png';
    }
    // If it already starts with http, return as is
    if (this.user.photoUrl.startsWith('http')) {
      return this.user.photoUrl;
    }
    // Otherwise, prepend the backend URL
    return `${this.backendUrl}${this.user.photoUrl}`;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file, file.name);

      this.authService.uploadPhoto(this.userId, formData).subscribe(
        (response: any) => {
          this.user.photoUrl = response.photoUrl; // e.g. "/uploads/filename.png"
        },
        (error) => {
          console.error('Error uploading photo:', error);
        }
      );
    }
  }

  resetPhoto(): void {
    this.authService.resetPhoto(this.userId).subscribe(
      (response) => {
        this.user.photoUrl = 'https://bootdey.com/img/Content/avatar/avatar1.png';
      },
      (error) => {
        console.error('Error resetting photo:', error);
      }
    );
  }

  // Save changes to the user profile
  saveChanges(): void {
    if (this.userForm.valid) {
      this.authService.updateUser(this.userId, this.userForm.value).subscribe(
        (response) => {
          alert('Profile updated successfully!');
        },
        (error) => {
          console.error('Error updating profile:', error);
          alert('Failed to update profile.');
        }
      );
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }
}

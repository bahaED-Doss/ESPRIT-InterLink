import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  
  signUpForm: FormGroup;
  step: number = 1;
  selectedRole: string = '';

  @ViewChild('signUpButton') signUpButton!: ElementRef;
  @ViewChild('signInButton') signInButton!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  passwordFieldType: string = 'password';

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) {
    this.signUpForm = this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      levelOfStudy: [''],
      espritEmail: [''],
      password: [''],
      confirmPassword: [''],
      companyName: [''],
      companyIdentifier: [''],
      industrySector: [''],
      companyAddress: [''],
      companyEmail: [''],
      contactNumber: [''],
      department: [''],
      yearsOfExperience: [''],
      professionalEmail: ['']
    });
  }

  ngAfterViewInit() {
    this.signUpButton.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.add("right-panel-active");
    });

    this.signInButton.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.remove("right-panel-active");
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onRoleChange(event: any) {
    this.selectedRole = event.target.value;
  }

  nextStep() {
    if (this.signUpForm.valid) {
      this.step = 2;
      this.cdRef.detectChanges(); // Manually trigger change detection
    } else {
      // Handle invalid form (could show validation errors)
      this.signUpForm.markAllAsTouched(); // Mark all fields as touched
    }
  }

  previousStep() {
    // Reset to the first step and clear any changes
    this.step = 1;
    this.signUpForm.markAsUntouched(); // Mark the form as untouched
    this.signUpForm.markAsPristine(); // Mark the form as pristine
    this.cdRef.detectChanges(); // Manually trigger change detection
    
    // Optionally, you can reset specific form controls as well
    this.signUpForm.controls['firstName'].reset();
    this.signUpForm.controls['lastName'].reset();
    
  }
  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Form Submitted:', this.signUpForm.value);
      // Handle form submission (e.g., send data to backend)
    }
  }
}

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      phoneNumber: [''],
      email: ['', [Validators.required, Validators.email]],
      levelOfStudy: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      companyName: [''],
      companyIdentifier: [''],
      industrySector: [''],
      companyAddress: [''],
      contactNumber: [''],
    });
     // Add conditional validation based on role
  this.signUpForm.get('role')?.valueChanges.subscribe((role) => {
    if (role === 'rh') {
      this.signUpForm.get('companyName')?.setValidators([Validators.required]);
      this.signUpForm.get('companyIdentifier')?.setValidators([Validators.required]);
      this.signUpForm.get('industrySector')?.setValidators([Validators.required]);
      this.signUpForm.get('companyAddress')?.setValidators([Validators.required]);
      this.signUpForm.get('contactNumber')?.setValidators([Validators.required]);
    } else {
      this.signUpForm.get('companyName')?.clearValidators();
      this.signUpForm.get('companyIdentifier')?.clearValidators();
      this.signUpForm.get('industrySector')?.clearValidators();
      this.signUpForm.get('companyAddress')?.clearValidators();
      this.signUpForm.get('contactNumber')?.clearValidators();
    }

    // Update the validity of the form controls
    this.signUpForm.get('companyName')?.updateValueAndValidity();
    this.signUpForm.get('companyIdentifier')?.updateValueAndValidity();
    this.signUpForm.get('industrySector')?.updateValueAndValidity();
    this.signUpForm.get('companyAddress')?.updateValueAndValidity();
    this.signUpForm.get('contactNumber')?.updateValueAndValidity();
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
   // Check if Step 1 is valid
   isStep1Valid(): boolean {
    return (
      !!this.signUpForm.get('gender')?.valid &&
      !!this.signUpForm.get('firstName')?.valid &&
      !!this.signUpForm.get('lastName')?.valid &&
      !!this.signUpForm.get('role')?.valid
    );
  }

  nextStep() {
    if (this.isStep1Valid()) {
      this.step = 2;
      this.cdRef.detectChanges(); // Manually trigger change detection
    } else {
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
  //sign UP
  onSubmit() {
    if (this.signUpForm.valid) {
      const user = this.signUpForm.value;
      console.log('Form Data:', user); // Debugging: Log form data
  
      // Ensure the role is sent in uppercase (as expected by the backend)
      user.role = user.role.toUpperCase();
  
      // Send the user data to the backend
      this.authService.register(user).subscribe(
        (response) => {
          alert('Registration successful!');
          this.signUpForm.reset();
          this.container.nativeElement.classList.remove('right-panel-active');
        },
        (error) => {
          console.error('Registration Error:', error); // Debugging: Log error
          alert('Registration failed: ' + error.message);
        }
      );
    } else {
      console.log('Form is invalid:', this.signUpForm.errors); // Debugging: Log form errors
      console.log('Form Controls:', this.signUpForm.controls); // Debugging: Log form controls
      alert('Please fill out all required fields.');
    }
  }
  //Login
  onLogin(form: NgForm) {
    if (form.invalid) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const credentials = {
      email: form.value.email,
      password: form.value.password
    };

    this.authService.login(credentials).subscribe(
      (response: any) => {
        const role = response.role;
        const id = response.id;

        // Redirect based on role
       
        if (role === 'STUDENT') {
          this.router.navigate(['/student-profile', id]);
        } else if (role === 'HR') {
          this.router.navigate(['/hr-profile', id]);
        } else if (role === 'ADMIN') {
          this.router.navigate(['/homeBack', id]);
        } else {
          alert('Invalid role');
        }
      },
      (error) => {
        alert('Login failed: ' + error.message);
      }
    );
  }
}

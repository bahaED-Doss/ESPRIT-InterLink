import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valid = /^(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,16}$/.test(control.value);
  return valid ? null : { password: true };
};

// Custom validator to check if the confirm password matches the password
const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const parent = control.parent;
  if (!parent) {
    return null;
  }
  const passwordControl = parent.get('password');
  if (!passwordControl) {
    return null;
  }
  const password = passwordControl.value;
  const confirmPassword = control.value;
  return password === confirmPassword ? null : { confirmPassword: true };
};

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent    {
  resetPasswordForm: FormGroup;
  email: string = ''
  successMessage: string = '';
  errorMessage: string = '';
  newPassword: string = '';
  token: string = '';


  @ViewChild('container') container!: ElementRef;
  

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialize Reset Password Form
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }
  

  // Handle Forgot Password Submission
  onForgotPassword() {
    if (this.email) {
      // Call the AuthService to send the password reset email
      this.authService.sendPasswordResetEmail(this.email).subscribe(
        response => {
          // Handle success response
          this.successMessage = 'Password reset link has been sent to your email.';
          this.errorMessage = '';
          this.email = ''; 
          
        },
        error => {
          // Handle error response
          this.errorMessage = 'There was an error sending the password reset email. Please try again.';
          this.successMessage = '';
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid email address.';
      this.successMessage = '';
    }
  }

  // Handle Reset Password Submission
  onResetPassword() {
    if (this.newPassword) {
      this.authService.resetPassword(this.token, this.newPassword).subscribe(
        (response) => {
          this.successMessage = 'Password has been reset successfully.';
          this.errorMessage = '';
          this.router.navigate(['/login']); // Redirect to login after reset
        },
        (error) => {
          this.errorMessage = error.error.message || 'Error in resetting password.';
          this.successMessage = '';
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid password.';
    }
  }
  

  // Flip to the Change Password form
 

  // Flip back to the Forgot Password form
  flipToForgotPassword() {
    this.container.nativeElement.classList.remove('right-panel-active');
  }
}

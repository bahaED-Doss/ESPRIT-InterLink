import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  newPassword: string = '';
  token: string = '';
  forgotPasswordForm: FormGroup;

  @ViewChild('container') container!: ElementRef;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialize Forgot Password Form with validation
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Handle Forgot Password Submission
  onForgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      this.errorMessage = 'Please enter a valid email address.';
      this.successMessage = '';
      return;
    }

    const email = this.forgotPasswordForm.get('email')?.value;

    // Check if the email exists in the database
    this.authService.checkEmailExists(email).subscribe(
      (emailExists: boolean) => {
        if (emailExists) {
          // Call the AuthService to send the password reset email
          this.authService.sendPasswordResetEmail(email).subscribe(
            response => {
              // Handle success response
              this.successMessage = 'Password reset link has been sent to your email.';
              this.errorMessage = '';
              this.forgotPasswordForm.reset();
            },
            error => {
              // Handle error response
              this.errorMessage = 'There was an error sending the password reset email. Please try again.';
              this.successMessage = '';
            }
          );
        } else {
          this.errorMessage = 'This email address is not registered.';
          this.successMessage = '';
        }
      },
      error => {
        this.errorMessage = 'There was an error checking the email address. Please try again.';
        this.successMessage = '';
      }
    );
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

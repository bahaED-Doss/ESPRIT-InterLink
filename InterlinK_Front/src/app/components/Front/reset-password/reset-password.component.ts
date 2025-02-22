import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize Reset Password Form
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Extract the token from the route parameters
    this.route.params.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.errorMessage = 'Invalid reset link. Please try again.';
      }
    });
  }

  onResetPassword(): void {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.password;

      // Call the AuthService to reset the password
      this.authService.resetPassword(this.token, newPassword).subscribe(
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
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }
}
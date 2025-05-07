import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/UserS/auth.service';

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
    // Initialize Reset Password Form with custom validators
    this.resetPasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            this.passwordValidator(), // Custom validator for special character
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.confirmPasswordValidator } // Cross-field validator
    );
  }

  ngOnInit(): void {
    // Extract the token from the route parameters
    this.route.params.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
        this.errorMessage = 'Invalid reset link. Please try again.';
      }
    });
  }

  // Custom validator for password (must contain at least one special character)
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      return hasSpecialCharacter ? null : { password: true };
    };
  }

  // Cross-field validator to check if confirmPassword matches password
  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { confirmPassword: true };
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
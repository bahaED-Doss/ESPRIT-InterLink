
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-changepasswordhr',
  templateUrl: './changepasswordhr.component.html',
  styleUrls: ['./changepasswordhr.component.css']
})
export class ChangepasswordhrComponent implements OnInit {
 changePasswordForm: FormGroup;
  userId!: number;
  user: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Create form with three controls
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.specialCharacterValidator()
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    // Get user ID from route parameters (as a string)
    this.userId = this.route.snapshot.params['id'];
    console.log("Logged-in user ID:", this.userId);

    // Fetch user data and populate both the local user variable and the form
    this.authService.getUserById(this.userId).subscribe((userData) => {
      this.user = userData; // Save the complete user object
      this.changePasswordForm.patchValue(userData); // Fill the form with user data
    });
  }

  // Custom validator: Ensure new password contains at least one special character.
  specialCharacterValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      // Check for at least one special character (you can adjust the character set as needed)
      if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return { noSpecialCharacter: true };
      }
      return null;
    };
  }

  // Custom validator: Confirm password must match new password.
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Called when the form is submitted.
  changePassword(): void {
    if (this.changePasswordForm.valid) {
      const passwordData = this.changePasswordForm.value;
      // Call the AuthService to change the password.
      this.authService.changePassword(this.userId, passwordData).subscribe(
        (response) => {
          alert('Password changed successfully!');
          // Optionally, redirect the user after success:
          this.router.navigate([`/profileHr`, this.userId]);
        },
        (error) => {
          console.error('Error changing password:', error);
          alert('Failed to change password. Please ensure your current password is correct.');
        }
      );
    } else {
      alert('Please fill out all fields correctly.');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/UserS/auth.service';
@Component({
  selector: 'app-sociallinkshr',
  templateUrl: './sociallinkshr.component.html',
  styleUrls: ['./sociallinkshr.component.css']
})
export class SociallinkshrComponent implements OnInit {
 socialForm: FormGroup;
  userId!: number;
  user: User | any;
  private backendUrl = 'http://localhost:8081';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Build the form for social links with validators
    this.socialForm = this.fb.group({
      facebook: ['', [this.urlValidator(/^(https?:\/\/)?(www\.)?facebook\.com\/.+$/)]],
      githubLink: ['', [this.urlValidator(/^(https?:\/\/)?(www\.)?github\.com\/.+$/)]],
      linkedin: ['', [this.urlValidator(/^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/)]],
      instagram: ['', [this.urlValidator(/^(https?:\/\/)?(www\.)?instagram\.com\/.+$/)]]
    });
  }

  ngOnInit(): void {
    // Get user ID from route parameters (or from localStorage if needed)
    this.userId = Number(this.route.snapshot.params['id'] || localStorage.getItem('userId'));
    console.log("Logged-in user ID:", this.userId);
    this.authService.getUserById(this.userId).subscribe((userData: User) => {
      this.user = userData;
      // Patch the form with the current social links
      this.socialForm.patchValue({
        facebook: userData.facebook,
        githubLink: userData.githubLink,
        linkedin: userData.linkedin,
        instagram: userData.instagram
      });
    });
  }

  // Custom URL validator: checks if value matches the given regex pattern.
  private urlValidator(regex: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      // If the field is empty, we'll treat it as valid (or you can add a required validator separately)
      if (!value) {
        return null;
      }
      return regex.test(value) ? null : { invalidUrl: true };
    };
  }

  saveSocialLinks(): void {
    if (this.socialForm.valid) {
      // Merge the social link updates with the existing user object
      const updatedData = { ...this.user, ...this.socialForm.value };
      this.authService.updateUser(this.userId, updatedData).subscribe(() => {
        alert('Social links updated successfully!');
      }, error => {
        console.error('Error updating social links:', error);
        alert('Failed to update social links.');
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}

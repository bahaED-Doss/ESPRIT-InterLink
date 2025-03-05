import { AfterViewInit, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators,AbstractControl, ValidationErrors, ValidatorFn  } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  // ViewChild references for Face ID modal
// Reference to the Face ID modal template.

  // Template reference for the Face ID modal
  @ViewChild('faceIdModal', { static: true }) faceIdModal!: TemplateRef<any>;

  passwordFieldType: string = 'password';

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.signUpForm = this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', [Validators.required, this.alphaOnlyValidator(), Validators.maxLength(10)]],
      lastName: ['', [Validators.required, this.alphaOnlyValidator(), Validators.maxLength(10)]],
      role: ['', Validators.required],
      phoneNumber: [''],
      email: ['', [Validators.required, Validators.email, this.espritEmailValidator()]],
      levelOfStudy: [''],
      password: ['', [Validators.required, Validators.minLength(9), this.passwordValidator()]],
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator()]],
      companyName: [''],
      companyIdentifier: [''],
      industrySector: [''],
      companyAddress: [''],
      contactNumber: [''],
    });

     // Add conditional validation based on role
     this.signUpForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === 'HR') {
        this.signUpForm.get('companyName')?.setValidators([Validators.required, this.alphaOnlyValidator(), Validators.maxLength(20)]);
        this.signUpForm.get('companyIdentifier')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        this.signUpForm.get('industrySector')?.setValidators([Validators.required]);
        this.signUpForm.get('companyAddress')?.setValidators([Validators.required, Validators.maxLength(20)]);
        this.signUpForm.get('contactNumber')?.setValidators([Validators.required, this.numericOnlyValidator(), Validators.minLength(8), Validators.maxLength(8)]);
        this.signUpForm.get('email')?.setValidators([Validators.required, Validators.email]);
        this.signUpForm.get('password')?.setValidators([Validators.required, Validators.minLength(9), this.passwordValidator()]);
        this.signUpForm.get('confirmPassword')?.setValidators([Validators.required, this.confirmPasswordValidator()]);
      } else if (role === 'student') {
        this.signUpForm.get('phoneNumber')?.setValidators([Validators.required, this.numericOnlyValidator(), Validators.minLength(8), Validators.maxLength(8)]);
        this.signUpForm.get('email')?.setValidators([Validators.required, Validators.email, this.espritEmailValidator()]);
        this.signUpForm.get('password')?.setValidators([Validators.required, Validators.minLength(9), this.passwordValidator()]);
        this.signUpForm.get('confirmPassword')?.setValidators([Validators.required, this.confirmPasswordValidator()]);
      }

      // Update the validity of the form controls
      this.signUpForm.get('companyName')?.updateValueAndValidity();
      this.signUpForm.get('companyIdentifier')?.updateValueAndValidity();
      this.signUpForm.get('industrySector')?.updateValueAndValidity();
      this.signUpForm.get('companyAddress')?.updateValueAndValidity();
      this.signUpForm.get('contactNumber')?.updateValueAndValidity();
      this.signUpForm.get('phoneNumber')?.updateValueAndValidity();
      this.signUpForm.get('email')?.updateValueAndValidity();
      this.signUpForm.get('password')?.updateValueAndValidity();
      this.signUpForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }
  /*
  loginWithGoogle(): void {
    this.authService.initiateGoogleLogin();
  }
    */
 
loginWithGoogle(): void {
  // No subscribe needed here since we're doing a redirect
  this.authService.initiateGoogleLogin();
}
loginWithGitHub() {
  const clientId = 'Ov23li3W3tktrxO5jxSn';
  const redirectUri = 'http://localhost:8081/api/auth/github/callback';
  const scope = 'read:user user:email';

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  window.location.href = authUrl;  // Redirige l'utilisateur vers GitHub
}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
          this.authService.loginWithGitHub(code); // Assurez-vous que le code est bien envoyé ici
      }
  })
/*
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        // Handle the Google callback
        this.authService.handleGoogleCallback(token).subscribe({
          next: (response: any) => {
            const role = response.role;
            const id = response.id;
  
            // Redirect based on role
            if (role === 'STUDENT') {
              this.router.navigate(['/student-profile', id]);
            } else {
              alert('Invalid role');
            }
          },
          error: (error) => {
            console.error('Google login failed:', error);
          }
        });
      }
    });
    */
    
  }
  // Custom Validators
  alphaOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!/^[a-zA-Z]+$/.test(value)) {
        return { alphaOnly: true }; // Return error if not alphabetic
      }
      return null; // No error
    };
  }

  numericOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!/^\d+$/.test(value)) {
        return { numericOnly: true }; // Return error if not numeric
      }
      return null; // No error
    };
  }

  espritEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value.endsWith('@esprit.tn')) {
        return { espritEmail: true }; // Return error if not an ESPRIT email
      }
      return null; // No error
    };
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) {
        return { passwordStrength: true }; // Return error if password doesn't contain a number or special character
      }
      return null; // No error
    };
  }

  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = this.signUpForm?.get('password')?.value;
      const confirmPassword = control.value;
      if (password !== confirmPassword) {
        return { passwordMismatch: true }; // Return error if passwords don't match
      }
      return null; // No error
    };
  }

  ngAfterViewInit() {
    this.signUpButton.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.add("right-panel-active");
    });

    this.signInButton.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.remove("right-panel-active");
    });
      // At this point, the video and canvas elements may not be rendered yet,
    // since they are inside an ng-template (the modal). We'll check when the modal opens.
    console.log('ngAfterViewInit: Face ID modal template available:', this.faceIdModal);
    
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
  
    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        const role = response.role;
        const id = response.id;
  
        // Store user information (id, role) in localStorage for later use
        localStorage.setItem('userId', id.toString()); // Store userId as string
        localStorage.setItem('userRole', role); // Store user role
  
        // Redirect based on role
        if (role === 'STUDENT') {
          this.router.navigate([`/student-profile/${id}`]);  // Redirect to student's profile
        } else if (role === 'HR') {
          this.router.navigate([`/hr-profile/${id}`]);
        } else if (role === 'PROJECT_MANAGER') {
          this.router.navigate([`/pm-profile/${id}`]);
        } else if (role === 'ADMIN') {
          this.router.navigate([`/homeBack/${id}`]);
        } else {
          alert('Invalid role');
        }
      },
      error: (error) => {
        alert('Login failed: ' + error.message);
      }
    });
  }
  openFaceIdModal(): void {
    console.log('openFaceIdModal called');
    const modalRef = this.modalService.open(this.faceIdModal, { size: 'lg' });
    modalRef.result.finally(() => {
      this.stopVideoStream();
    });
    // Use a delay to ensure modal content is rendered
    setTimeout(() => {
      const videoElem = document.getElementById('videoElement') as HTMLVideoElement;
      if (videoElem) {
        console.log('Found video element:', videoElem);
        this.startVideoStreamUsing(videoElem);
      } else {
        console.error('Video element not found after modal open');
      }
    }, 300); // Adjust delay if needed
  }

  startVideoStreamUsing(videoElem: HTMLVideoElement): void {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        console.log('Video stream obtained:', stream);
        videoElem.srcObject = stream;
        videoElem.play();
      })
      .catch(err => {
        console.error("Error accessing webcam:", err);
      });
  }

  stopVideoStream(): void {
    const videoElem = document.getElementById('videoElement') as HTMLVideoElement;
    if (videoElem && videoElem.srcObject) {
      const stream = videoElem.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoElem.srcObject = null;
      console.log('Video stream stopped');
    } else {
      console.warn('No video stream found to stop');
    }
  }

  captureFace(): void {
    const videoElem = document.getElementById('videoElement') as HTMLVideoElement;
    const canvasElem = document.getElementById('canvasElement') as HTMLCanvasElement;
    if (!videoElem) {
      console.error("captureFace: Video element not found");
      return;
    }
    if (!canvasElem) {
      console.error("captureFace: Canvas element not found");
      return;
    }
    const context = canvasElem.getContext('2d');
    if (!context) {
      console.error("captureFace: Unable to get canvas context");
      return;
    }
    context.drawImage(videoElem, 0, 0, canvasElem.width, canvasElem.height);
    const imageData = canvasElem.toDataURL('image/png');
    console.log("Captured image data:", imageData);
    this.stopVideoStream();
    this.modalService.dismissAll();
    // Call Face ID login service method
    this.authService.loginWithFaceId({ image: imageData }).subscribe({
      next: (response: any) => {
        console.log("Face login successful, response:", response);
        const role = response.role;
        const id = response.id;
        localStorage.setItem('userId', id.toString());
        localStorage.setItem('userRole', role);
        if (role === 'STUDENT') {
          this.router.navigate([`/student-profile/${id}`]);
        } else if (role === 'HR') {
          this.router.navigate([`/hr-profile/${id}`]);
        } else if (role === 'PROJECT_MANAGER') {
          this.router.navigate([`/pm-profile/${id}`]);
        } else if (role === 'ADMIN') {
          this.router.navigate([`/homeBack/${id}`]);
        } else {
          alert("Invalid role");
        }
      },
      error: (err) => {
        console.error("Face login error:", err);
        alert("Face login failed");
      }
    });
  }

}

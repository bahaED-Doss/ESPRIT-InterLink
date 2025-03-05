import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8081/api'; // Replace with your backend URL
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    
   
  }


  loginWithGitHub(code: string) {
    return this.http.get(`${this.apiUrl}/auth/github/callback`, {
      params: { code }
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('role', response.role);
  
        // Redirection en fonction du rôle
        if (response.role === 'STUDENT') {
          this.router.navigate(['/student-profile', response.id]);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error("GitHub authentication failed", error);
        alert('GitHub authentication failed');
      }
    });
  }
  
  loginWithFaceId(faceData: { image: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/face`, faceData);
  }

 
/*
logout() {
    this.oauthService.logOut();
}
*/

  initiateGoogleLogin() {
    // First get the auth URL from backend
    this.http.get(`${this.apiUrl}/auth/google/init`, { responseType: 'text' })
      .subscribe(authUrl => {
        // Redirect to Google login
        window.location.href = authUrl;
      });
  }

  handleGoogleCallback(code: string) {
    return this.http.get(`${this.apiUrl}/auth/google/callback`, {
      params: { code }
    }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          // Store JWT token
          localStorage.setItem('token', response.token);
          
          // Store user role and ID
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('userId', response.id);
  
          // Redirect based on role
          if (response.role === 'STUDENT') {
            this.router.navigate(['/student-profile', response.id]);
          } else {
            this.router.navigate(['/']); // Redirect elsewhere if not a student
          }
        }
      })
    );
  }
  
  loginWithGoogle(googleUser: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/google-login`, googleUser);
  }
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Register a new user
  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Registration error:", error);
        return throwError(() => new Error("Registration failed. Please try again."));
      })
    );
  }
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  }
  blockUser(id: number, block: boolean): Observable<any> {
    // block == true => block user
    // block == false => unblock user
    const url = `${this.apiUrl}/user/${id}/block`;
    const body = { block }; // e.g. { block: true }
    return this.http.put(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      // We can receive a JSON with a { message: "..."} so:
      responseType: 'json'
    });
  }
  
  getUserById(id: number) {
    return this.http.get(`${this.apiUrl}/user/${id}`);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/userss`);
  }
  changePassword(id: number, passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/user/${id}/change-password`, passwordData, { headers, responseType: 'text' });
  }
  
 // Upload photo to the server
 uploadPhoto(id: number, formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/user/${id}/upload-photo`, formData);
}

// Reset photo to default
resetPhoto(id: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/user/${id}/reset-photo`, {}, { responseType: 'text' });
}

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/Users`, user); // Ensure correct endpoint
  }

  updateUser(id: number, user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user/${id}`, user);
  }

  deleteUser(id: any): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${id}`);
  }

  // Login user
  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Redirect to profile based on role
  redirectToProfile(role: string, id: number) {
    switch (role) {
      case 'STUDENT':
        this.router.navigate(['/student-profile', id]);
        break;
      case 'HR':
        this.router.navigate(['/hr-profile', id]);
        break;
      case 'PROJECT_MANAGER':
        this.router.navigate(['/pm-profile', id]);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
  sendPasswordResetEmail(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email: email };
    return this.http.post(`${this.apiUrl}/forgotPassword`, body, { headers });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { token: token, newPassword: newPassword };
    return this.http.post(`${this.apiUrl}/resetPassword`, body, { headers });
  }
}
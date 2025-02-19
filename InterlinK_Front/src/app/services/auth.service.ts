import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api'; // Replace with your backend URL
 
  constructor(private http: HttpClient, private router: Router) {}

  // Register a new user
  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Registration error:", error);
        return throwError(() => new Error("Registration failed. Please try again."));
      })
    );
  }
  getUserById(id: number) {
    return this.http.get(`${this.apiUrl}/user/${id}`);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/userss`);
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
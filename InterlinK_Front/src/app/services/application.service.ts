import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Application } from '../models/Application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8081/application'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  // ✅ Récupérer toutes les candidatures
  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/retrieve-all-applications`).pipe(
      catchError((error) => {
        console.error('Error fetching applications:', error);
        return throwError(() => new Error('Failed to fetch applications. Please try again.'));
      })
    );
  }

  // ✅ Récupérer une candidature par son ID
  getApplicationById(applicationId: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/retrieve-application/${applicationId}`).pipe(
      catchError((error) => {
        console.error('Error fetching application by ID:', error);
        return throwError(() => new Error('Failed to fetch application. Please try again.'));
      })
    );
  }

  // ✅ Ajouter une nouvelle candidature
  addApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/add-application`, application).pipe(
      catchError((error) => {
        console.error('Error adding application:', error);
        return throwError(() => new Error('Failed to add application. Please try again.'));
      })
    );
  }

  // ✅ Supprimer une candidature
  deleteApplication(applicationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-application/${applicationId}`).pipe(
      catchError((error) => {
        console.error('Error deleting application:', error);
        return throwError(() => new Error('Failed to delete application. Please try again.'));
      })
    );
  }

  // ✅ Modifier une candidature
  updateApplication(applicationId: number, updatedApplication: Application): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/modify-application/${applicationId}`, updatedApplication).pipe(
      catchError((error) => {
        console.error('Error updating application:', error);
        return throwError(() => new Error('Failed to update application. Please try again.'));
      })
    );
  }

  // ✅ Récupérer les candidatures d'un étudiant par son ID
  getApplicationsByStudentId(studentId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/retrieve-applications-by-student/${studentId}`).pipe(
      catchError((error) => {
        console.error('Error fetching applications by student ID:', error);
        return throwError(() => new Error('Failed to fetch applications. Please try again.'));
      })
    );
  }
}
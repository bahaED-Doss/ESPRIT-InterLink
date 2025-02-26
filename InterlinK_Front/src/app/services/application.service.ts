import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/Application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8081/application'; // Remplace par ton URL backend

  constructor(private http: HttpClient) {}

  // ✅ Récupérer toutes les candidatures
  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/retrieve-all-applications`);
  }
  getApplicationById(applicationId: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/retrieve-application/${applicationId}`);
}
  // ✅ Ajouter une candidature
  addApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/add-application`, application);
  }

  // ✅ Supprimer une candidature
  deleteApplication(applicationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-application/${applicationId}`);
}

  // ✅ Modifier une candidature
  updateApplication(applicationId: number, updatedApplication: Application): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/modify-application`, applicationId);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Internship } from '../models/Internship.model';
@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  private apiUrl = 'http://localhost:8081/internships'; // Assure-toi que c'est bien cette URL

  constructor(private http: HttpClient) {}

  // Récupérer tous les stages
  getInternships(): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.apiUrl}/retrieve-all-internships`);
  }

  // Ajouter un stage
  addInternship(internship: Internship): Observable<Internship> {
    return this.http.post<Internship>(`${this.apiUrl}/add-internship`, internship);
  }

  // Modifier un stage
  updateInternship(id: number, internship: Internship): Observable<Internship> {
    return this.http.put<Internship>(`${this.apiUrl}/modify-internship`, internship);
  }

  // Supprimer un stage
  deleteInternship(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-internship/${id}`);
  }

  // Récupérer un stage par ID
  getInternshipById(id: number): Observable<Internship> {
    return this.http.get<Internship>(`${this.apiUrl}/internship-by-id/${id}`);
  }
  // Postuler à un stage
applyForInternship(applicationData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/apply`, applicationData);
}

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Education } from '../../models/education';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EducationService {


  private apiUrl = 'http://localhost:8081/api/education';

  constructor(private http: HttpClient) { }

  getEducationsByUserId(userId: number): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/${userId}`);
  }

  addEducation(userId: number, education: Education): Observable<Education> {
    return this.http.post<Education>(`${this.apiUrl}/add/${userId}`, education);
  }

  updateEducation(education: Education): Observable<Education> {
    return this.http.put<Education>(`${this.apiUrl}/update`, education);
  }

  deleteEducation(educationId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${educationId}`);
  }
}
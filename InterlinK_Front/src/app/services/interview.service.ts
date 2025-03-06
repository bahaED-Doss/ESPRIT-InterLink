import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interview } from '../models/Interview';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private apiUrl = 'http://localhost:8081/api/interviews'; // Remplace par ton URL backend

  constructor(private http: HttpClient) {}

  getInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(this.apiUrl + '/all');
  }

  getInterviewsById(id: any): Observable<Interview[]> {
    return this.http.get<Interview[]>(this.apiUrl + '/' + id);
  }

  addInterview(interview: Interview): Observable<Interview> {
    return this.http.post<Interview>(this.apiUrl, interview);
  }

  deleteInterview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateInterview(interview: Interview): Observable<Interview> {
    return this.http.put<Interview>(
      `${this.apiUrl}/${interview.interviewId}`,
      interview
    );
  }

  getRankAndPercent(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/getRang/${id}`, {
      responseType: 'text',
    });
  }
}

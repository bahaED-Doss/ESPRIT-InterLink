import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interview } from '../models/interview.model';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = 'http://localhost:8081/api/interviews'; // URL du backend

  constructor(private http: HttpClient) {}

  getInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(this.apiUrl);
  }

  getInterviewById(id: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.apiUrl}/${id}`);
  }

  addInterview(interview: Interview): Observable<Interview> {
    return this.http.post<Interview>(this.apiUrl, interview);
  }

  updateInterview(interview: Interview): Observable<Interview> {
    return this.http.put<Interview>(`${this.apiUrl}/${interview.interviewId}`, interview);
  }

  deleteInterview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

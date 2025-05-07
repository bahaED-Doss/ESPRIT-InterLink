import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interview } from '../models/interview';


@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private apiUrl = 'http://localhost:8081/api/interviews'; // Remplace par ton URL backend

  constructor(private http: HttpClient) {}

  getInterviews(): Observable<any> {
    return this.http.get<Interview>(this.apiUrl + '/all');
  }

  getInterviewsById(id: any): Observable<Interview> {
    return this.http.get<Interview>(this.apiUrl + '/' + id);
  }

  addInterview(data: any): Observable<Interview> {
    return this.http.post<Interview>(this.apiUrl + '/add', data);
  }

  deleteInterview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  updateInterview(id: number, interview: Interview): Observable<Interview> {
    return this.http.post<Interview>(this.apiUrl + '/update/' + id, interview);
  }

  getRankAndPercent(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/getRang/${id}`, {
      responseType: 'text',
    });
  }

  searchInterview(param: string): Observable<any> {
    return this.http.get(this.apiUrl + '/search', { params: { param } });
  }

  getApplication(): Observable<any> {
    return this.http.get<Interview>(this.apiUrl + '/application');
  }

  getProjectManger(): Observable<any> {
    return this.http.get<Interview>(this.apiUrl + '/projectmanager');
  }

  getUser(): Observable<any> {
    return this.http.get<Interview>(this.apiUrl + '/user');
  }
}
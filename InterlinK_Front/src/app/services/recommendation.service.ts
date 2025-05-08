import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  private apiUrl = 'http://127.0.0.1:5000/recommend'; // Flask API endpoint

  constructor(private http: HttpClient) {}

  getRecommendations(skills: string[]): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any[]>(this.apiUrl, { skills }, { headers });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RecommendationResponse {
  success: boolean;
  recommendations: {
    internship: {
      id: number;
      title: string;
      description: string;
      requiredSkill: string;
      companyName: string;
      duration: string;
      type: string;
      location: string;
      startDate: string;
      endDate: string;
      availableSpots: number;
    };
    score: number;
    matchedSkill: string | null;
  }[];
  studentSkills: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = 'http://127.0.0.1:5000/recommend';

  constructor(private http: HttpClient) {}

  getRecommendations(skills: string[]): Observable<RecommendationResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<RecommendationResponse>(this.apiUrl, { skills }, { headers });
  }
}

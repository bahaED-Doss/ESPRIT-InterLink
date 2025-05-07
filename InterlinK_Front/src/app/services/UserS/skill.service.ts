import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  addSkill(userId: number, skill: { name: string, type: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/skills/add/${userId}`, skill);
  }

  getSkillsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/skills/${userId}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(public httpClient: HttpClient) {}
  private baseUrl = 'http://localhost:8081/api/question/';

  public getAllByTest(id: any): Observable<Question> {
    return this.httpClient.get<Question>(this.baseUrl + id);
  }

  public add(data: any): Observable<Question> {
    return this.httpClient.post<Question>(this.baseUrl + 'add', data);
  }
}

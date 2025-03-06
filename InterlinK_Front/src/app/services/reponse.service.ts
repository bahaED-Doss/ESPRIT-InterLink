import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Test } from '../models/test';
import { Reponse } from '../models/reponse';

@Injectable({
  providedIn: 'root',
})
export class ReponseService {
  private subject = new Subject<any>();
  constructor(public httpClient: HttpClient) {}

  private baseUrl = 'http://localhost:8081/api/reponse/';

  public getAllByQuestion(ids: any, idt: any): Observable<Reponse> {
    return this.httpClient.get<Reponse>(
      this.baseUrl + 'findByQuestion/' + ids + '/' + idt
    );
  }

  public add(data: any[], id: any): Observable<Reponse[]> {
    return this.httpClient.post<Reponse[]>(this.baseUrl + 'add/' + id, data);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Test } from '../models/test';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private subject = new Subject<any>();
  constructor(public httpClient: HttpClient) {}

  private baseUrl = 'http://localhost:8081/api/test/';

  sendNotification(value: any) {
    this.subject.next({ ID: value });
  }

  //this will be subscribed by the listing component which needs to display the //added/deleted ie updated list.

  getNotification() {
    return this.subject.asObservable();
  }

  public getAll(): Observable<Test> {
    return this.httpClient.get<Test>(this.baseUrl + 'all');
  }

  public add(data: any): Observable<Test> {
    return this.httpClient.post<Test>(this.baseUrl + 'add', data);
  }

  public edit(id: number, data: any): Observable<Test> {
    return this.httpClient.put<Test>(this.baseUrl + 'update/' + id, data);
  }
  public delete(id: any): Observable<Test> {
    return this.httpClient.delete<Test>(this.baseUrl + 'delete/' + id);
  }

  public getById(id: number): Observable<Test> {
    return this.httpClient.get<Test>(this.baseUrl + id);
  }
}

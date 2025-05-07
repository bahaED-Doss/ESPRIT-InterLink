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

  public getById(id: any): Observable<Test> {
    return this.httpClient.get<Test>(this.baseUrl + id);
  }

  searchTests(param: string): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'search', { params: { param } });
  }
}
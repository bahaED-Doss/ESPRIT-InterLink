
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8081/internships/chatbot'; // Remplacez par votre endpoint

  constructor(private http: HttpClient) { }

  askQuestion(question: string): Observable<string> {
    return this.http.post<string>(this.apiUrl, { question });
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8080/api/chatbot'; // Adaptez à votre backend

  constructor(private http: HttpClient) { }

  askQuestion(question: string) {
    return this.http.post<string>(`${this.apiUrl}/ask`, question, {
      responseType: 'text' as 'json'
    });
  }
}
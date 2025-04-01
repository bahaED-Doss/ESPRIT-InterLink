// chatgpt.service.ts
/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatGPTService {
  private readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  private conversationHistory = new BehaviorSubject<ChatMessage[]>([]);
  
  constructor(private http: HttpClient) {
    this.initializeChat();
  }

  private initializeChat(): void {
    this.addSystemMessage("Tu es un assistant spécialisé dans les stages académiques. Réponds en français de manière concise et utile.");
  }

  getConversation() {
    return this.conversationHistory.asObservable();
  }

  async sendMessage(userMessage: string): Promise<void> {
    if (!userMessage.trim()) return;

    // Ajoute le message utilisateur
    this.addUserMessage(userMessage);

    try {
      const response = await this.http.post<any>(this.API_URL, {
        model: "gpt-3.5-turbo",
        messages: this.getFullConversation(),
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${environment.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }).toPromise();

      const aiResponse = response.choices[0].message.content;
      this.addAssistantMessage(aiResponse);
    } catch (error) {
      console.error('ChatGPT Error:', error);
      this.addAssistantMessage("Désolé, je rencontre des difficultés. Pouvez-vous reformuler ?");
    }
  }

  private getFullConversation(): any[] {
    return this.conversationHistory.value.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  private addSystemMessage(content: string): void {
    this.addMessage('system', content);
  }

  private addUserMessage(content: string): void {
    this.addMessage('user', content);
  }

  private addAssistantMessage(content: string): void {
    this.addMessage('assistant', content);
  }

  private addMessage(role: 'system'|'user'|'assistant', content: string): void {
    const current = this.conversationHistory.value;
    this.conversationHistory.next([...current, { role, content }]);
  }
}

interface ChatMessage {
  role: 'system'|'user'|'assistant';
  content: string;
}*/
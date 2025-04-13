package tn.esprit.interlink_back.service;

import org.springframework.stereotype.Service;

// ChatbotService.java (RAG)
@Service
public class ChatbotService {

    public String getChatbotResponse(String userMessage) {
        // 1. Envoyez la question à votre API RAG (ex: Flask avec LlamaIndex)
        // 2. Retournez la réponse
        return "Réponse générée via RAG...";
    }
}
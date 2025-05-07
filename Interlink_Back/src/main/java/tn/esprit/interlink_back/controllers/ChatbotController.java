package tn.esprit.interlink_back.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.interlink_back.services.ChatbotService;
import tn.esprit.interlink_back.services.ChatbotService;

// ChatbotController.java
@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/ask")
    public ResponseEntity<String> askQuestion(@RequestBody String question) {
        String response = chatbotService.getChatbotResponse(question);
        return ResponseEntity.ok(response);
    }
}
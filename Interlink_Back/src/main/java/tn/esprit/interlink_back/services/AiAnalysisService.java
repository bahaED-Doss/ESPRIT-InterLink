package tn.esprit.interlink_back.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.esprit.interlink_back.entity.Enums.Sentiment;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiAnalysisService {
    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String apiUrl;

    public AiAnalysisService(
            RestTemplate restTemplate,
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.url}") String apiUrl) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }

    public AIAnalysisResponse analyzeFeedback(String taskContent, String feedbackMessage) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String prompt = String.format(
            "Task Description: %s\nFeedback: %s\n\nAnalyze this feedback and respond in this exact format:\nSENTIMENT: [POSITIVE/NEGATIVE/NEUTRAL]\nHINT: [If sentiment is negative, provide a constructive suggestion. Otherwise, leave empty]",
            taskContent, 
            feedbackMessage
        );

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, String> parts = new HashMap<>();
        parts.put("text", prompt);
        contents.put("parts", Collections.singletonList(parts));
        requestBody.put("contents", Collections.singletonList(contents));

        String url = apiUrl + "?key=" + apiKey;

        try {
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            
            String content = root.path("candidates").get(0)
                                .path("content").path("parts").get(0)
                                .path("text").asText();

            String[] lines = content.split("\n");
            Sentiment sentiment = Sentiment.NEUTRAL;
            String hint = null;

            for (String line : lines) {
                if (line.startsWith("SENTIMENT:")) {
                    sentiment = Sentiment.valueOf(line.substring(10).trim());
                } else if (line.startsWith("HINT:")) {
                    hint = line.substring(5).trim();
                    if (hint.isEmpty()) hint = null;
                }
            }

            return new AIAnalysisResponse(sentiment, hint);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to analyze feedback: " + e.getMessage());
        }
    }
}
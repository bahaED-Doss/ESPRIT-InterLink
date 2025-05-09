package tn.esprit.interlink_back.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationController.class);
    private final RestTemplate restTemplate;

    @Value("${recommendation.service.url:http://127.0.0.1:5000/recommend}")
    private String flaskUrl;

    public RecommendationController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping
    public ResponseEntity<?> getRecommendations(@RequestBody List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Collections.singletonMap("error", "Skills list cannot be empty")
            );
        }

        // Normalize skills to match Flask expectations
        List<String> normalizedSkills = skills.stream()
                .map(String::toUpperCase)
                .map(skill -> {
                    switch (skill) {
                        case "BUSINESS_INTELLIGENCE": return "BI";
                        case "DATA_SCIENCE": return "DATASCIENCE";
                        case "SOFTWARE_ENGINEERING": return "GENIELOGICIEL";
                        default: return skill;
                    }
                })
                .collect(Collectors.toList());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> payload = Map.of("skills", normalizedSkills);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            logger.info("Requesting recommendations for skills: {}", skills);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    flaskUrl,
                    request,
                    String.class
            );
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            logger.error("Failed to fetch recommendations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Collections.singletonMap("error", "Failed to fetch recommendations. Please try again later.")
            );
        }
    }
}
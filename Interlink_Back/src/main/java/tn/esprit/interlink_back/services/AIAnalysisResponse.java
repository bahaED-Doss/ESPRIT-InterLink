package tn.esprit.interlink_back.services;

import tn.esprit.interlink_back.entity.Enums.Sentiment;

public class AIAnalysisResponse {
    private Sentiment sentiment;
    private String hint;

    public AIAnalysisResponse() {}

    public AIAnalysisResponse(Sentiment sentiment, String hint) {
        this.sentiment = sentiment;
        this.hint = hint;
    }

    public Sentiment getSentiment() {
        return sentiment;
    }

    public void setSentiment(Sentiment sentiment) {
        this.sentiment = sentiment;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }
}
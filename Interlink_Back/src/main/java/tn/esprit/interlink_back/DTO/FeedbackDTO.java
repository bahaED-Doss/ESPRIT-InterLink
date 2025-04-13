package tn.esprit.interlink_back.DTO;

import tn.esprit.interlink_back.entity.Enums.Sentiment;
import tn.esprit.interlink_back.entity.Feedback;
import java.time.LocalDateTime;

public class FeedbackDTO {
    private Long feedbackId;
    private String message;
    private String givenBy; 
    private LocalDateTime createdAt;
    private Sentiment sentiment;
    private Long taskId;
    private Long projectManagerId; 
    private Long studentId;
    private boolean seen= false     ;

    // Constructors
    public FeedbackDTO() {}

    public FeedbackDTO(Long feedbackId, String message, String givenBy,
                       LocalDateTime createdAt, Sentiment sentiment, Long taskId,
                       Long projectManagerId, Long studentId, boolean seen) {
        this.feedbackId = feedbackId;
        this.message = message;
        this.givenBy = givenBy;
        this.createdAt = createdAt;
        this.sentiment = sentiment;
        this.taskId = taskId;
        this.projectManagerId = projectManagerId;
        this.studentId = studentId;
        this.seen = seen;
    }

    // Existing getters and setters
    public Long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Long feedbackId) {
        this.feedbackId = feedbackId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getGivenBy() {
        return givenBy;
    }

    public void setGivenBy(String givenBy) {
        this.givenBy = givenBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Sentiment getSentiment() {
        return sentiment;
    }

    public void setSentiment(Sentiment sentiment) {
        this.sentiment = sentiment;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
    
    // New getters and setters
    public Long getProjectManagerId() {
        return projectManagerId;
    }

    public void setProjectManagerId(Long projectManagerId) {
        this.projectManagerId = projectManagerId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    
    public boolean isSeen() {
        return seen;
    }
    
    public void setSeen(boolean seen) {
        this.seen = seen;
    }
}
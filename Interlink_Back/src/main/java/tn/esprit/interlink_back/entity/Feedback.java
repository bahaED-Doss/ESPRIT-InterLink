package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.Data;
import tn.esprit.interlink_back.entity.Enums.Sentiment;

import java.time.LocalDateTime;

@Data
@Entity
public class Feedback {
    @Id
    @GeneratedValue
    private Long feedbackId;

    private String message;
    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean seen = false;
    @Enumerated(EnumType.STRING)
    private Sentiment sentiment;

    @ManyToOne
    @JoinColumn(name = "taskId", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User projectManager;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;
}

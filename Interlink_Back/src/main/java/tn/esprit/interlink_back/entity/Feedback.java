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
    private String givinBy;
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private Sentiment sentiment ;

    @ManyToOne
    @JoinColumn(name = "taskId", nullable = false)
    private Task task;

    //private Long studentId
    //@ManyToOne
    //@JoinColumn(name = "user_id", nullable = false)
    //private User givenBy;

}

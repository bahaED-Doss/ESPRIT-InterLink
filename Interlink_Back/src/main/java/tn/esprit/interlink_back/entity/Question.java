package tn.esprit.interlink_back.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

public class Question
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @GeneratedValue
    private Long feedbackId;

    private String message;
    private String givinBy;
    private LocalDateTime createdAt = LocalDateTime.now();
}

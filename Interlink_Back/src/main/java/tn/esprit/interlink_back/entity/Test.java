package tn.esprit.interlink_back.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

public class Test
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private  int interviewId;

  

    private String message;
    private String givinBy;
    private LocalDateTime createdAt = LocalDateTime.now();
}

package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import tn.esprit.interlink_back.entity.Enums.SatisfactionRating;
import tn.esprit.interlink_back.entity.Enums.TaskPriority;
import tn.esprit.interlink_back.entity.Enums.TaskStatus;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity

public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long TaskId;
    private String title;
    private String description;
    private Date deadline ;
    private LocalDateTime CreatedAt;
    private float timer ;





    @Enumerated(EnumType.STRING)
    private TaskPriority priority ;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    private SatisfactionRating rating;  // 🔥, 👍, 🤔, ⚠️

    //private Long studentId;
    private Long ManagerId;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<Feedback> feedbacks;


    @ManyToOne

    @JoinColumn(name = "projectId", nullable = false)
    private Project project;



}

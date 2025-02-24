package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;


@Entity
public class Medal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long MedalId;
    private String MedalName;
    private String MedalDescription;
    private String MImageUrl;
    private int count  ; // how many times the student got this medal

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false) // Medals belong to students

    private User student;

}

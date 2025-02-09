package tn.esprit.interlink_back.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Trophy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trophyId;
    private String trophyName;
    private String criteria;
    private String TimageUrl;
    private Long projectId;
    //private Long StudentId;
}

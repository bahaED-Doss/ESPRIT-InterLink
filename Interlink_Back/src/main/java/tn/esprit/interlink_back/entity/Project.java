package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    private String title;
    private String description;
    private Date startDate;
    private Date endDate;
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company; // Each project belongs to one company

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User projectManager; // Each project is managed by one manager

}


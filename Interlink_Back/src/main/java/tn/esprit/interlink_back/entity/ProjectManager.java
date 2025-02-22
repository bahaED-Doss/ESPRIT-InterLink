package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class ProjectManager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long managerId;

    private String department;
    private int yearsOfExperience;
    private String professionalEmail;
    private boolean status;

    @OneToMany(mappedBy = "projectManager", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> projects; // A manager can oversee multiple projects


}

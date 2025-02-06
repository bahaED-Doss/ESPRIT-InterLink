package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long companyId;

    private String name;
    private String location;
    private String email;
    private String phone;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> projects; // A company can have multiple projects




}

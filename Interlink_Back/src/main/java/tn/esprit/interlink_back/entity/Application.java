package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;

import java.util.List;
@Entity
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;
    private String status;
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Interview> interviews; // Une candidature peut avoir plusieurs entretien

    

}

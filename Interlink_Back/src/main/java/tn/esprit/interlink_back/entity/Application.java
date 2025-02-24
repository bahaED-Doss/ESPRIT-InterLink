package tn.esprit.interlink_back.entity;

//<<<<<<< HEAD
import jakarta.persistence.*;

import java.util.List;
//=====
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
// >>>>>>> 91ac1aa ( HomePage - template front)
@Entity
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;
    private String status;
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Interview> interviews; // Une candidature peut avoir plusieurs entretien

    

}

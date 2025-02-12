package tn.esprit.interlink_back.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;
    private String status;


    

}

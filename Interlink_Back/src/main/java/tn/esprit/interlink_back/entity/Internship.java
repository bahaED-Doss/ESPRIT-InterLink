package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;

public class Internship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long IntershipId;
    private String Title;
    private String Description;
    private String Location;
    private String Duration  ;
    private String Type;
    @Enumerated(EnumType.STRING)
    private requiredSkill skill ;

}

package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import tn.esprit.interlink_back.entity.Enums.requiredSkill;
@Entity
<<<<<<< HEAD
=======

>>>>>>> 91ac1aa ( HomePage - template front)
public class Intership {
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

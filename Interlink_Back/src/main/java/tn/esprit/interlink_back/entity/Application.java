package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long applicationId;
 
    @Enumerated(EnumType.STRING) // Stocke l'Enum sous forme de texte
     ApplicationStatus status;

     String firstName;
     String lastName;
     String email;
     String phoneNumber;
     String cv; 
// Relation ManyToOne avec Internship
    @ManyToOne
    @JoinColumn(name = "internship_id")
     Internship internship;
    

}

package tn.esprit.interlink_back.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty

    @Enumerated(EnumType.STRING) // Stocke l'Enum sous forme de texte
     ApplicationStatus status;

    @JsonProperty
    String firstName;
    @JsonProperty
    String lastName;
    @JsonProperty
    String email;
    @JsonProperty
    String phoneNumber;
    @JsonProperty
    String cv;
// Relation ManyToOne avec Internship
    @ManyToOne
    @JoinColumn(name = "internship_id")
     Internship internship;
    

}

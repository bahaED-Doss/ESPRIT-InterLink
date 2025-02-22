package tn.esprit.interlink_back.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long internshipId;

    @JsonProperty
    String title;

@JsonProperty
    String description;

    @JsonProperty
    String localisation;

    @JsonProperty
    @Enumerated(EnumType.STRING)
    InternshipDuration duration;

    @JsonProperty
    @Enumerated(EnumType.STRING)
    InternshipType type; // Enum pour le type de stage

    @JsonProperty
    @Enumerated(EnumType.STRING)
    requiredSkill skill;

    @JsonProperty
    Date startDate; // Date de début

    @JsonProperty
    Date endDate; // Date de fin

     @JsonProperty
    String companyName; // Nom de l’entreprise

    @JsonProperty
    int availableSpots; // Nombre de places disponibles

    // Relation OneToMany avec Application
    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL)
    List<Application> applications;
}

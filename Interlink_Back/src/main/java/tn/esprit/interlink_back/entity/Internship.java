package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
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

    String title;
    String description;
    String localisation;

    @Enumerated(EnumType.STRING)
    InternshipDuration duration;
    @Enumerated(EnumType.STRING)
    InternshipType type; // Enum pour le type de stage

    @Enumerated(EnumType.STRING)
    requiredSkill skill;

    LocalDate startDate; // Date de début
    LocalDate endDate; // Date de fin

    String companyName; // Nom de l’entreprise
    int availableSpots; // Nombre de places disponibles

    // Relation OneToMany avec Application
    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL)
    List<Application> applications;
}

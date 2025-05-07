package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.interlink_back.entity.Education;

public interface EducationRepository extends JpaRepository<Education, Long> {
    // If needed, add custom queries here
}
package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.interlink_back.entity.Internship;

public interface InternshipRepository extends JpaRepository<Internship, Long> {
}

package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.interlink_back.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}

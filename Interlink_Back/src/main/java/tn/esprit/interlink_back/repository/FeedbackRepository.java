package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.interlink_back.entity.Feedback;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByTaskTaskId(Long taskId);
    
    // Find feedbacks by project manager ID
    List<Feedback> findByProjectManagerId(Long managerId);
    
    // Find feedbacks by student ID
    List<Feedback> findByStudentId(Long studentId);
    
    // Find feedbacks by task ID and user ID (either as project manager or student)
    List<Feedback> findByTaskTaskIdAndProjectManagerId(Long taskId, Long managerId);
    List<Feedback> findByTaskTaskIdAndStudentId(Long taskId, Long studentId);
    
    // Find unseen feedbacks
    List<Feedback> findBySeenFalse();
    
    // Find unseen feedbacks for a specific task
    List<Feedback> findByTaskTaskIdAndSeenFalse(Long taskId);
    
    // Find unseen feedbacks for a specific user
    List<Feedback> findByProjectManagerIdAndSeenFalse(Long managerId);
    List<Feedback> findByStudentIdAndSeenFalse(Long studentId);
}

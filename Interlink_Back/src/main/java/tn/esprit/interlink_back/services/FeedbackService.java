package tn.esprit.interlink_back.services;

import tn.esprit.interlink_back.entity.Feedback;
import tn.esprit.interlink_back.entity.Task;
import tn.esprit.interlink_back.repository.FeedbackRepository;
import tn.esprit.interlink_back.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService implements IFeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private TaskRepository taskRepository;

    // Get all feedbacks for a task
    public List<Feedback> getFeedbacksByTaskId(Long taskId) {
        return feedbackRepository.findByTaskTaskId(taskId);
    }

    // Create a new feedback
    public Feedback createFeedback(Feedback feedback, Long taskId, Long userId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (!taskOpt.isPresent()) {
            throw new RuntimeException("Task not found with id: " + taskId);
        }

        feedback.setTask(taskOpt.get());
        feedback.setCreatedAt(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    // Update an existing feedback
    public Feedback updateFeedback(Long feedbackId, Feedback feedbackDetails) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        if (!feedbackOpt.isPresent()) {
            throw new RuntimeException("Feedback not found with id: " + feedbackId);
        }

        Feedback feedback = feedbackOpt.get();
        feedback.setMessage(feedbackDetails.getMessage());
        feedback.setSentiment(feedbackDetails.getSentiment());

        return feedbackRepository.save(feedback);
    }

    // Delete a feedback
    public void deleteFeedback(Long feedbackId) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        if (!feedbackOpt.isPresent()) {
            throw new RuntimeException("Feedback not found with id: " + feedbackId);
        }

        feedbackRepository.delete(feedbackOpt.get());
    }

    @Override
    public Feedback markFeedbackAsSeen(Long feedbackId) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        if (!feedbackOpt.isPresent()) {
            throw new RuntimeException("Feedback not found with id: " + feedbackId);
        }
        
        Feedback feedback = feedbackOpt.get();
        feedback.setSeen(true);
        return feedbackRepository.save(feedback);
    }


    // Get a specific feedback by ID
    public Feedback getFeedbackById(Long feedbackId) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        if (!feedbackOpt.isPresent()) {
            throw new RuntimeException("Feedback not found with id: " + feedbackId);
        }

        return feedbackOpt.get();
    }
}
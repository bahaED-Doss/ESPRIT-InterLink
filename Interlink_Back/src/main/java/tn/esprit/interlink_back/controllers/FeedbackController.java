package tn.esprit.interlink_back.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.DTO.FeedbackDTO;
import tn.esprit.interlink_back.entity.Feedback;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.entity.Enums.Role;
import tn.esprit.interlink_back.services.FeedbackService;
import tn.esprit.interlink_back.services.statticUserServiceTasks;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;
    
    @Autowired
    private statticUserServiceTasks userService; // You'll need this to get the current user

    // Get all feedbacks for a task
    @GetMapping("/tasks/{taskId}/feedbacks")
    public ResponseEntity<List<Feedback>> getFeedbacksByTaskId(@PathVariable Long taskId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByTaskId(taskId);
        return new ResponseEntity<>(feedbacks, HttpStatus.OK);
    }

    // Create a new feedback for a task
    @PostMapping("/tasks/{taskId}/feedbacks/{userId}")
    public ResponseEntity<Feedback> createFeedback(
            @PathVariable Long taskId, 
            @PathVariable Long userId, 
            @RequestBody FeedbackDTO feedbackDTO) {
        
        // Create and set up the feedback
        Feedback feedback = new Feedback();
        feedback.setMessage(feedbackDTO.getMessage());
        feedback.setSentiment(feedbackDTO.getSentiment());
        
        // Let the service handle setting the appropriate user based on role
        Feedback createdFeedback = feedbackService.createFeedback(feedback, taskId, userId);
        return new ResponseEntity<>(createdFeedback, HttpStatus.CREATED);
    }

    // Get a specific feedback
    @GetMapping("/feedbacks/{feedbackId}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long feedbackId) {
        Feedback feedback = feedbackService.getFeedbackById(feedbackId);
        return new ResponseEntity<>(feedback, HttpStatus.OK);
    }

    // Update a feedback
    @PutMapping("/feedbacks/{feedbackId}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Long feedbackId, @RequestBody Feedback feedbackDetails) {
        Feedback updatedFeedback = feedbackService.updateFeedback(feedbackId, feedbackDetails);
        return new ResponseEntity<>(updatedFeedback, HttpStatus.OK);
    }

    // Delete a feedback
    @DeleteMapping("/feedbacks/{feedbackId}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long feedbackId) {
        feedbackService.deleteFeedback(feedbackId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Mark a feedback as seen
    @PatchMapping("/feedbacks/{feedbackId}/seen")
    public ResponseEntity<Feedback> markFeedbackAsSeen(@PathVariable Long feedbackId) {
        Feedback updatedFeedback = feedbackService.markFeedbackAsSeen(feedbackId);
        return new ResponseEntity<>(updatedFeedback, HttpStatus.OK);
    }
}
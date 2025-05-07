package tn.esprit.interlink_back.services;

import tn.esprit.interlink_back.entity.Feedback;

import java.util.List;

public interface IFeedbackService {
    List<Feedback> getFeedbacksByTaskId(Long taskId);
    Feedback createFeedback(Feedback feedback, Long taskId, Long userId);
    Feedback updateFeedback(Long feedbackId, Feedback feedbackDetails);
    void deleteFeedback(Long feedbackId);
    Feedback markFeedbackAsSeen(Long feedbackId);
}

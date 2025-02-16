package tn.esprit.interlink_back.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Interview;
import tn.esprit.interlink_back.repository.InterviewRepository;

import java.util.List;
import java.util.Optional;

@Service

public class InterviewService
{
    private final InterviewRepository interviewRepository;
    public  InterviewService (InterviewRepository interviewRepository)
    {
        this.interviewRepository = interviewRepository;
    }
    // Ajouter un entretien
    public Interview addInterview(Interview interview) {
        return interviewRepository.save(interview);
    }
    //affichage tous les entretiens
    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    // affichage par ID
    public Optional<Interview> getInterviewById(int id) {
        return interviewRepository.findById(id);
    }

    // update entretien
    public Interview updateInterview(int id, Interview newInterview) {
        return interviewRepository.findById(id).map(interview -> {
            interview.setInterviewDate(newInterview.getInterviewDate());
            interview.setType(newInterview.getType());
            interview.setStatus(newInterview.getStatus());
            interview.setLienReunion(newInterview.getLienReunion());
            return interviewRepository.save(interview);
        }).orElseThrow(() -> new RuntimeException("Interview avec ID " + id + " non trouvée"));
    }

    // Supprimer un entretien
    public void deleteInterview(int id) {
        interviewRepository.deleteById(id);
    }
}

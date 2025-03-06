package tn.esprit.interlink_back.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Interview;
import tn.esprit.interlink_back.repository.InterviewRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    // update entretien
    public Interview updateInterview(int id, Interview newInterview) {
        return interviewRepository.findById(id).map(interview -> {
            interview.setInterviewDate(newInterview.getInterviewDate());
            interview.setInterviewType(newInterview.getInterviewType());
            interview.setStatusType(newInterview.getStatusType());
            interview.setLienReunion(newInterview.getLienReunion());
            return interviewRepository.save(interview);
        }).orElseThrow(() -> new RuntimeException("Interview avec ID " + id + " non trouvée"));
    }


    // Supprimer un entretien
    public void deleteInterview(int id) {
        interviewRepository.deleteById(id);
    }

    public Interview getInterviewByIdTestAndIdStudent(Long ids,Long idt) {
        return interviewRepository.findByStudentAndTestId(ids,idt);
    }

    public String affichePercentAndRage(int i) {
        Interview interview = getInterviewById(i).get();
        return "The percentage of the Test is " + calculatePercentage(interview) + "% and its rank is: " + calculateRank(interview);    }


    public double calculatePercentage(Interview interview) {
        double scoreObtained = interview.getNote();
        double maxScore = interview.getTestByTestId().getNote();
        System.err.println("scoreObtained: " + scoreObtained + " maxScore: " + maxScore);
        if (maxScore == 0) {
            return 0;
        }
        return (scoreObtained / maxScore) * 100;
    }

    public int calculateRank(Interview interview) {

        List<Interview> allInterviews = interviewRepository.findAll();
        List<Interview> interviewsForSameTest = allInterviews.stream()
                .filter(i -> i.getTestId().equals(interview.getTestId()))
                .collect(Collectors.toList());

        interviewsForSameTest.sort((i1, i2) -> Double.compare(i2.getNote(), i1.getNote()));

        for (int rank = 0; rank < interviewsForSameTest.size(); rank++) {
            if (interviewsForSameTest.get(rank).equals(interview)) {
                return rank + 1;
            }
        }

        return -1;
    }
}

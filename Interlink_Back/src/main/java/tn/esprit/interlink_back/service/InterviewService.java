package tn.esprit.interlink_back.service;

import com.google.api.services.calendar.model.*;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Application;
import tn.esprit.interlink_back.entity.Enums.StatusType;
import tn.esprit.interlink_back.entity.Interview;
import tn.esprit.interlink_back.entity.ProjectManager;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.ApplicationRepository;
import tn.esprit.interlink_back.repository.InterviewRepository;
import tn.esprit.interlink_back.repository.ProjectManagerRepository;
import tn.esprit.interlink_back.repository.UserRepository;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;


import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;

@Service
public class InterviewService
{
    private final InterviewRepository interviewRepository;
    private final ProjectManagerRepository projectManagerRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private Calendar calendarService;
    public  InterviewService (InterviewRepository interviewRepository, ProjectManagerRepository projectManagerRepository
    , UserRepository userRepository, ApplicationRepository applicationRepository, GoogleCalendarConfig calendarConfig, Calendar calendarService)
    {
        this.interviewRepository = interviewRepository;
        this.projectManagerRepository = projectManagerRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.calendarService = calendarService;
    }
    // Ajouter un entretien
    public Interview addInterview(Interview interview) throws Exception {
        interview.setStatusType(StatusType.PLANIFIE);
        System.err.println(creerMeet(interview));
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

        // Trier les entretiens par note décroissante
        interviewsForSameTest.sort((i1, i2) -> Double.compare(i2.getNote(), i1.getNote()));

        // Trouver le rang de l'étudiant
        for (int rank = 0; rank < interviewsForSameTest.size(); rank++) {
            if (interviewsForSameTest.get(rank).equals(interview)) {
                return rank + 1; // Le rang commence à 1, donc on ajoute 1
            }
        }

        return -1; // Si l'étudiant n'a pas été trouvé
    }


    public List<Interview> getAllSearch(String param) {
        return interviewRepository.search(param);
    }

    public List<Application> getAllApplication() {
        return applicationRepository.findAll();
    }
    public List<User> getAllUser() {
        return userRepository.findAll();
    }
    public List<ProjectManager> getAllProjectManger() {
        return projectManagerRepository.findAll();
    }


    public String creerMeet(Interview interview) throws Exception {
        Event event = new Event()
                .setSummary(interview.getTitre())
                .setDescription("Générée avec un compte gratuit");

        // Configuration de l'heure avec timestamp (sans time zone)
        Date interviewDate = interview.getInterviewDate();
        DateTime startTime = new DateTime(interviewDate);
        DateTime endTime = new DateTime(interviewDate.getTime() + 3600000);

        // Définir le fuseau horaire dans EventDateTime
        event.setStart(new EventDateTime()
                .setDateTime(startTime)
                .setTimeZone("Europe/Paris"));

        event.setEnd(new EventDateTime()
                .setDateTime(endTime)
                .setTimeZone("Europe/Paris"));

        // Configuration Google Meet
        ConferenceSolutionKey conferenceKey = new ConferenceSolutionKey()
                .setType("hangoutsMeet");

        ConferenceSolution conferenceSolution = new ConferenceSolution()
                .setKey(conferenceKey)
                .setName("Google Meet");

        CreateConferenceRequest conferenceRequest = new CreateConferenceRequest()
                .setRequestId("meet-" + System.currentTimeMillis())
                .setConferenceSolutionKey(conferenceKey);

        ConferenceData conferenceData = new ConferenceData()
                .setCreateRequest(conferenceRequest)
                .setConferenceSolution(conferenceSolution);

        event.setConferenceData(conferenceData);

        // Création de l'événement
        Event createdEvent = calendarService.events()
                .insert("sammeeh44@gmail.com", event)
                .setConferenceDataVersion(1)
                .execute();

        if (createdEvent.getConferenceData() != null){
            return createdEvent.getConferenceData().getEntryPoints().get(0).getUri();
        }
        else{
            return "";
        }

    }
}

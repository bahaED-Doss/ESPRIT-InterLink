package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
public class Interview
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int interviewId;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id", nullable = false)
    private User student; // Chaque entretien est lié à un seul étudiant

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_manager_id", nullable = false)
    private ProjectManager projectManager; // Un Project Manager peut faire plusieurs entretiens

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application; // L'entretien est lié à une candidature



    @Column(nullable = false)
    private LocalDateTime interviewDate; // Utilisation de LocalDateTime pour la date et l'heure de l'entretien


    private String type; // Type d’entretien (technique, RH, final..)
    private String status; // Statut de l’entretien (planifié, réalisé, annulé)

    private String lienReunion; // Lien de la réunion (Google Meet, Zoom...)

    // Constructeurs
    public Interview() {}


    public Interview(User student, ProjectManager projectManager, Application application, Date date, String type, String status, String lienReunion) {
        this.student = student;
        this.projectManager = projectManager;
        this.application = application;
        this.interviewDate = interviewDate;
        this.type = type;
        this.status = status;
        this.lienReunion = lienReunion;
    }

    // Getters et Setters
    public int getInterviewId() {

        return interviewId;
    }

    public void setInterviewId(int interviewId) {

        this.interviewId = interviewId;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public ProjectManager getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public LocalDateTime getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(LocalDateTime interviewDate) {
        this.interviewDate = interviewDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLienReunion() {
        return lienReunion;
    }

    public void setLienReunion(String lienReunion) {
        this.lienReunion = lienReunion;
    }

}

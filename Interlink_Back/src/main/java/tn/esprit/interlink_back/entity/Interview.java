package tn.esprit.interlink_back.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.interlink_back.entity.Enums.InterviewType;
import tn.esprit.interlink_back.entity.Enums.StatusType;



import java.util.Date;

@Entity
@Getter
@AllArgsConstructor
public class Interview
{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int interviewId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id")
    private User student; // Chaque entretien est lié à un seul étudiant

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_manager_id")
    private ProjectManager projectManager; // Un Project Manager peut faire plusieurs entretiens

    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application; // L'entretien est lié à une candidature

    @Column(nullable = false)
    private Date interviewDate;

    @Enumerated(EnumType.STRING)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Column(nullable = false)
    private InterviewType interviewType; // Type d’entretien (technique, meeting ..)

    @Enumerated(EnumType.STRING)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Column(nullable = false)
    private StatusType statusType; // Statut de l’entretien (planifié, réalisé, annulé)

    private String lienReunion;

    // Constructeurs
    public Interview() {}

    public Interview(User student, ProjectManager projectManager, Application application, Date interviewDate, InterviewType interviewType, StatusType statusType, String lienReunion) {
        this.student = student;
        this.projectManager = projectManager;
        this.application = application;
        this.interviewDate = interviewDate;
        this.interviewType = interviewType;
        this.statusType = statusType;
        this.lienReunion = lienReunion;
    }
    //getter,setter
    public Date getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(Date interviewDate) {
        this.interviewDate = interviewDate;
    }
    public InterviewType getInterviewType() {
        return interviewType;
    }

    public void setInterviewType(InterviewType interviewType) {
        this.interviewType = interviewType;
    }

    public StatusType getStatusType() {
        return statusType;
    }

    public void setStatusType(StatusType statusType) {
        this.statusType = statusType;
    }
    public String getLienReunion() {
        return lienReunion;
    }

    public void setLienReunion(String lienReunion) {
        this.lienReunion = lienReunion;
    }



}
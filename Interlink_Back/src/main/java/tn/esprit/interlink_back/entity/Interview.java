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

    @Column(name = "student_id")
    private Long student; // Chaque entretien est lié à un seul étudiant

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id", referencedColumnName = "id",insertable = false,updatable = false)
    private User studentByUserId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "manager_id", referencedColumnName = "managerId",insertable = false,updatable = false)
    private ProjectManager projectManager; // Un Project Manager peut faire plusieurs entretiens

    @Column(name = "manager_id")
    private Long managerId ;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "test_id", referencedColumnName = "testId",insertable = false,updatable = false)
    private Test testByTestId;

    @Column(name = "test_id")
    private Long testId ;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
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
    private String titre;
    private int note ;

    public Interview() {
    }

    public int getInterviewId() {
        return interviewId;
    }

    public void setInterviewId(int interviewId) {
        this.interviewId = interviewId;
    }

    public Long getStudent() {
        return student;
    }

    public void setStudent(Long student) {
        this.student = student;
    }

    public User getStudentByUserId() {
        return studentByUserId;
    }

    public void setStudentByUserId(User studentByUserId) {
        this.studentByUserId = studentByUserId;
    }

    public ProjectManager getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public Test getTestByTestId() {
        return testByTestId;
    }

    public void setTestByTestId(Test testByTestId) {
        this.testByTestId = testByTestId;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

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

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public int getNote() {
        return note;
    }

    public void setNote(int note) {
        this.note = note;
    }
}
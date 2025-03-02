package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import tn.esprit.interlink_back.entity.Enums.TestType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "test_table") // Pour éviter un conflit avec le mot-clé SQL "TEST"
public class Test
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int testId; // Identifiant unique du test

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student; // Chaque test est lié à un seul étudiant

    @ManyToOne
    @JoinColumn(name = "project_manager_id", nullable = false)
    private User projectManager; // Un Project Manager peut superviser plusieurs tests

    @OneToOne
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview; // Un test est associé à un seul entretien

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestType typeTest; // Type de test (Technique ou SoftSkill)

    @Column(nullable = false)
    private int note=0; // Note obtenue au test

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    private List<Question> questions = new ArrayList<>();

    // Constructeurs
    public Test() {}

    public Test(User student, User projectManager, Interview interview, TestType typeTest) {
        this.student = student;
        this.projectManager = projectManager;
        this.interview = interview;
        this.typeTest = typeTest;
        this.note = 0;
    }

    // Getters et Setters
    public int getTestId() {
        return testId;
    }

    public void setTestId(int testId) {
        this.testId = testId;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public User getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(User projectManager) {
        this.projectManager = projectManager;
    }

    public Interview getInterview() {
        return interview;
    }

    public void setInterview(Interview interview) {
        this.interview = interview;
    }

    public TestType getTypeTest() {
        return typeTest;
    }

    public void setTypeTest(TestType typeTest) {
        this.typeTest = typeTest;
    }

    public int getNote() {
        return note;
    }

    public void setNote(int note) {
        this.note = note;
    }


}
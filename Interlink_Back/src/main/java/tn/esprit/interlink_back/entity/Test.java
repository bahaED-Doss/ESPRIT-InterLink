package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import tn.esprit.interlink_back.entity.Enums.TestType;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
public class Test
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId; // Identifiant unique du test


    @Column(name = "student_id", length = 20)
    private Long student; // Chaque test est lié à un seul étudiant

    @ManyToOne
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "student_id", referencedColumnName = "id", insertable = false, updatable = false, nullable = false)
    private User userById;


    @Column(name = "project_manager_id")
    private Long projectManager;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "project_manager_id", referencedColumnName = "managerId", insertable = false, updatable = false, nullable = false)
    private ProjectManager projectManagerByProjectManagerId;

    @OneToOne
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview; // Un test est associé à un seul entretien

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestType typeTest; // Type de test (Technique ou SoftSkill)

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    @Column
    private int note; // Note obtenue au test

    private String titre ;

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public Long getStudent() {
        return student;
    }

    public void setStudent(Long student) {
        this.student = student;
    }

    public User getUserById() {
        return userById;
    }

    public void setUserById(User userById) {
        this.userById = userById;
    }

    public Long getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(Long projectManager) {
        this.projectManager = projectManager;
    }

    public ProjectManager getProjectManagerByProjectManagerId() {
        return projectManagerByProjectManagerId;
    }

    public void setProjectManagerByProjectManagerId(ProjectManager projectManagerByProjectManagerId) {
        this.projectManagerByProjectManagerId = projectManagerByProjectManagerId;
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

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public int getNote() {
        return note;
    }

    public void setNote(int note) {
        this.note = note;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }
}
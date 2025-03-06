package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Table(name = "question")// Assure un nom correct en base de données
public class Question {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int questionId;
    @Column(name="test_id")
    private Long testId;

    private String contenu;
    @Column
    private int noteAttribuee=0; // Gérée automatiquement

    @ManyToOne
    @JoinColumn(name = "test_id", referencedColumnName = "testId",insertable = false,updatable = false)
    private Test testById;

    // Constructeur
    public Question() {
    }

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }


    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public int getNoteAttribuee() {
        return noteAttribuee;
    }

    public void setNoteAttribuee(int noteAttribuee) {
        this.noteAttribuee = noteAttribuee;
    }

    public Test getTestById() {
        return testById;
    }

    public void setTestById(Test testById) {
        this.testById = testById;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    @Override
    public String toString() {
        return "Question{" +
                "questionId=" + questionId +
                ", testId=" + testId +
                ", contenu='" + contenu + '\'' +
                ", noteAttribuee=" + noteAttribuee +
                ", testById=" + testById +
                '}';
    }
}





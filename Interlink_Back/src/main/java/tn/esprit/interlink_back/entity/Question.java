package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import tn.esprit.interlink_back.entity.Enums.TestType;

import java.time.LocalDateTime;
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

    @Column(nullable = false)
    private String contenu; // Le texte de la question

    @Column
    private String reponse;

    @Column
    private Boolean evaluation; // ✔️ true si correct, ❌ false si incorrect

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

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public String getReponse() {
        return reponse;
    }

    public void setReponse(String reponse) {
        this.reponse = reponse;
    }

    public Boolean getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(Boolean evaluation) {
        this.evaluation = evaluation;
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
}





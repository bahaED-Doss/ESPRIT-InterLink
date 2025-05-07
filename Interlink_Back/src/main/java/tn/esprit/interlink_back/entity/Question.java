package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import tn.esprit.interlink_back.entity.Enums.TestType;

import java.time.LocalDateTime;
@Entity
@Table(name = "question")// Assure un nom correct en base de données
public class Question {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int questionId;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;
    /*
        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private TestType type;

     */
    @Column(nullable = false)
    private String contenu; // Le texte de la question

    @Column
    private String reponse;

    @Column
    private Boolean evaluation; // ✔️ true si correct, ❌ false si incorrect

    @Column
    private int noteAttribuee=0; // Gérée automatiquement


    // Constructeur
    public Question() {
    }

    public Question(Test test, String contenu, String reponse) {
        this.test = test;

        this.contenu = contenu;
        this.reponse = reponse;
        this.evaluation = null;
        // Par défaut, aucune évaluation
        //this.noteAttribuee = 0; // Par défaut, 0 points
    }

    // Getters et Setters
    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }


    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }


    public Boolean getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(Boolean evaluation) {

        if (this.evaluation != null) {
            throw new IllegalStateException("L'évaluation ne peut pas être modifiée après validation !");
        }
        this.evaluation = evaluation;

        // 🚀 Mise à jour automatique de la note :
        if (evaluation != null) {
            this.noteAttribuee = evaluation ? 1 : 0; // 1 points si correcte, 0 sinon
        }
    }

    public int getNoteAttribuee() {
        return noteAttribuee;
    }

}



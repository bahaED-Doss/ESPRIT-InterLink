package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@AllArgsConstructor
@ToString
public class Reponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reponseId;
    @Column
    private Boolean evaluation;
    @Column
    private String reponse;
    @ManyToOne
    @JoinColumn(name = "question_id", referencedColumnName = "questionId",insertable = false,updatable = false)
    private Question questionById;

    @Column(name="question_id")
    private int questionId;

    @Column(name = "student_id")
    private Long student;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id", referencedColumnName = "id",insertable = false,updatable = false)
    private User studentByUserId;

    public Reponse() {
    }

    public Long getReponseId() {
        return reponseId;
    }

    public void setReponseId(Long reponseId) {
        this.reponseId = reponseId;
    }

    public Boolean getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(Boolean evaluation) {
        this.evaluation = evaluation;
    }

    public String getReponse() {
        return reponse;
    }

    public void setReponse(String reponse) {
        this.reponse = reponse;
    }

    public Question getQuestionById() {
        return questionById;
    }

    public void setQuestionById(Question questionById) {
        this.questionById = questionById;
    }

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
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

    @Override
    public String toString() {
        return "Reponse{" +
                "reponseId=" + reponseId +
                ", evaluation=" + evaluation +
                ", reponse='" + reponse + '\'' +
                ", questionById=" + questionById +
                ", questionId=" + questionId +
                ", student=" + student +
                ", studentByUserId=" + studentByUserId +
                '}';
    }
}

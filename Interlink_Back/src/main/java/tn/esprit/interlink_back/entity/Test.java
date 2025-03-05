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
@Data
public class Test
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId; // Identifiant unique du test
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestType typeTest; // Type de test (Technique ou SoftSkill)



    @Column
    private int note; // Note obtenue au test

    private String titre ;


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


    public TestType getTypeTest() {
        return typeTest;
    }

    public void setTypeTest(TestType typeTest) {
        this.typeTest = typeTest;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public Test(Long testId, TestType typeTest, List<Question> questions, int note, String titre) {
        this.testId = testId;
        this.typeTest = typeTest;
        this.note = note;
        this.titre = titre;
    }

    public Test() {
    }
}
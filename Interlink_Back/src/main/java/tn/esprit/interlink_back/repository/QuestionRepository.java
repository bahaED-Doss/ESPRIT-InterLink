package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Question;
import tn.esprit.interlink_back.entity.Test;

import java.util.List;
@Repository
public interface QuestionRepository extends JpaRepository <Question, Integer>
{
    //  Trouver toutes les questions d'un test spécifique
    List<Question> findByTestId(Long testId);

    // Trouver les questions ayant une évaluation correcte (true)
    List<Question> findByEvaluationTrue();

    //  Trouver les questions non encore évaluées (null)
    List<Question> findByEvaluationIsNull();
}

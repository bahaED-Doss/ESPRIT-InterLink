package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Question;

import java.util.List;
@Repository
public interface QuestionRepository extends JpaRepository <Question, Integer>
{
    List<Question> findByTestId(Long testId);

}

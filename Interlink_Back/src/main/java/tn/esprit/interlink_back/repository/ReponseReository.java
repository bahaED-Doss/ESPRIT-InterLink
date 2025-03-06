package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.interlink_back.entity.Reponse;

import java.util.List;

public interface ReponseReository extends JpaRepository<Reponse, Long> {
    List<Reponse> findByQuestionId(Long questionId);
    @Query(value = "SELECT r.* FROM reponse r JOIN question q on q.question_id = r.question_id\n" +
            "JOIN test t on q.test_id = t.test_id\n" +
            "JOIN interview I ON i.test_id = t.test_id\n" +
            "WHERE r.student_id =:studentId AND t.test_id =:testId",nativeQuery = true)
    List<Reponse> findReponseByStuentAndTest(@Param("studentId") Long studentId, @Param("testId") Long testId);
}

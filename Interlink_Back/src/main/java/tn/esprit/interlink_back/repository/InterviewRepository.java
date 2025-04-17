package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.*;
import tn.esprit.interlink_back.entity.Enums.InterviewType;
import tn.esprit.interlink_back.entity.Enums.StatusType;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface InterviewRepository extends JpaRepository<Interview, Integer>
{
    //  Trouver tous les entretiens pour un étudiant donné
    List<Interview> findByStudent(User student);

    //  Trouver tous les entretiens d'un project manager donné
    List<Interview> findByProjectManager(ProjectManager projectManager);

    //  Trouver tous les entretiens liés à une candidature donnée
    List<Interview> findByApplication(Application application);

    // Trouver tous les entretiens d'un type spécifique
    List<Interview> findByInterviewType(InterviewType interviewType);

    //  Trouver tous les entretiens planifiés après une certaine date
    List<Interview> findByInterviewDateAfter(LocalDateTime date);

    //  Trouver tous les entretiens avec un statut spécifique (planifié, réalisé, annulé)
    List<Interview> findByStatusType(StatusType statusType);

    Interview findByStudentAndTestId(Long student, Long testId);


    @Query(value = "SELECT t.* FROM interview t WHERE t.titre LIKE CONCAT('%', :param, '%') OR t.lienReunion LIKE CONCAT('%', :param, '%') ORDER BY t.titre ASC", nativeQuery = true)
    List<Interview> search(@Param("param") String param);

}

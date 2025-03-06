package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Application;
import tn.esprit.interlink_back.entity.Enums.InterviewType;
import tn.esprit.interlink_back.entity.Enums.StatusType;
import tn.esprit.interlink_back.entity.Interview;
import tn.esprit.interlink_back.entity.ProjectManager;
import tn.esprit.interlink_back.entity.User;

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

}

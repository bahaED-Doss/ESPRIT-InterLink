package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Test;
import tn.esprit.interlink_back.entity.User;

import java.util.List;
@Repository
public interface TestRepository extends JpaRepository<Test, Integer>
{    //Trouver tous les tests d'un étudiant
    List<Test> findByStudent(User student);
    //Trouver tous les tests d'un project manager
    List<Test> findByProjectManager_Id(int projectManagerId);
    //Trouver un test par interview
    Test findByInterview_InterviewId(int interviewId);


}

package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Enums.Role;
import tn.esprit.interlink_back.entity.Project;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT p FROM Project p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Project> searchProjects(@Param("keyword") String keyword);

    @Query("SELECT p.status, COUNT(p) FROM Project p GROUP BY p.status")
    List<Object[]> getProjectStatusStatistics();

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.company WHERE p.projectId = :projectId")
    Project findByProjectIdWithCompany(@Param("projectId") Long projectId);



    @Query("SELECT p FROM Project p WHERE p.manager.id = :userId AND p.manager.role = :role")
    List<Project> findByUserIdAndRole(@Param("userId") Long userId, @Param("role") Role role);

    @Query("Select p FROM Project p WHERE p.student.id = :userId AND p.student.role = :role")
    List<Project> findPByStudentId(@Param("userId") Long userId, @Param("role") Role role);
}

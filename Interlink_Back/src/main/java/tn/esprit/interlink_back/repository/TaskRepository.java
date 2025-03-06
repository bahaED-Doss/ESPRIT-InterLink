package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tn.esprit.interlink_back.entity.Task;
import tn.esprit.interlink_back.entity.Enums.TaskStatus;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.project.projectId = :projectId")
    List<Task> findByProjectId(Long projectId);

    @Query("SELECT t FROM Task t WHERE t.project.projectId = :projectId AND t.taskId = :taskId")
    Optional<Task> findByProjectIdAndTaskId(Long projectId, Long taskId);

    @Query("SELECT t FROM Task t WHERE t.student.id = :studentId")
    List<Task> findByStudentId(Long studentId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.projectId = :projectId AND t.status = :status")
    Long countTasksByProjectAndStatus(Long projectId, TaskStatus status);
}

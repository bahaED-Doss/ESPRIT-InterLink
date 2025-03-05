package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.interlink_back.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}

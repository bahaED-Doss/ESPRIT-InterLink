package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.ProjectManager;

@Repository
public interface ProjectManagerRepository extends JpaRepository<ProjectManager, Long> {
}


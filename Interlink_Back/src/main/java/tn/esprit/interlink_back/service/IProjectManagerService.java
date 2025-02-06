package tn.esprit.interlink_back.service;

import tn.esprit.interlink_back.entity.ProjectManager;
import java.util.List;
import java.util.Optional;

public interface IProjectManagerService {
    List<ProjectManager> getAllManagers();
    Optional<ProjectManager> getManagerById(Long id);
    ProjectManager createManager(ProjectManager manager);
    Optional<ProjectManager> updateManager(Long id, ProjectManager managerDetails);
    void deleteManager(Long id);
}


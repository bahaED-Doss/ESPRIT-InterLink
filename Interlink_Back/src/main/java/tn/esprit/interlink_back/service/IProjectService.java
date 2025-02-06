package tn.esprit.interlink_back.service;


import tn.esprit.interlink_back.entity.Project;
import java.util.List;
import java.util.Optional;

public interface IProjectService {
    List<Project> getAllProjects();
    Optional<Project> getProjectById(Long id);
    Project createProject(Project project);
    Optional<Project> updateProject(Long id, Project projectDetails);
    void deleteProject(Long id);
}

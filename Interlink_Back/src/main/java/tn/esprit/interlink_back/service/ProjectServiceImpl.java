package tn.esprit.interlink_back.service;


import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.repository.ProjectRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectServiceImpl implements IProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    @Override
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public Optional<Project> updateProject(Long id, Project projectDetails) {
        return projectRepository.findById(id).map(projectRepository::save);
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}


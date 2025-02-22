package tn.esprit.interlink_back.service;

import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.repository.ProjectRepository;

import java.util.List;

@Service
public class ProjectServiceImpl implements IProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public List<Project> retrieveAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project retrieveProject(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    @Override
    public Project addProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public Project modifyProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public void removeProject(Long id) {
        projectRepository.deleteById(id);
    }
}

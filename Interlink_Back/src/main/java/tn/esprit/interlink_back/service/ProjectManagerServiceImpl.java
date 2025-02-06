package tn.esprit.interlink_back.service;

import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.ProjectManager;
import tn.esprit.interlink_back.repository.ProjectManagerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectManagerServiceImpl implements IProjectManagerService {

    private final ProjectManagerRepository managerRepository;

    public ProjectManagerServiceImpl(ProjectManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    @Override
    public List<ProjectManager> getAllManagers() {
        return managerRepository.findAll();
    }

    @Override
    public Optional<ProjectManager> getManagerById(Long id) {
        return managerRepository.findById(id);
    }

    @Override
    public ProjectManager createManager(ProjectManager manager) {
        return managerRepository.save(manager);
    }

    @Override
    public Optional<ProjectManager> updateManager(Long id, ProjectManager managerDetails) {
        return managerRepository.findById(id).map(managerRepository::save);
    }

    @Override
    public void deleteManager(Long id) {
        managerRepository.deleteById(id);
    }
}


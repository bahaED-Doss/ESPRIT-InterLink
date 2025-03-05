package tn.esprit.interlink_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.dtos.ProjectStatisticsDTO;
import tn.esprit.interlink_back.entity.Enums.MilestoneStatus;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.entity.Milestone;
import tn.esprit.interlink_back.repository.MilestoneRepository;
import tn.esprit.interlink_back.repository.ProjectRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements IProjectService {

    private final ProjectRepository projectRepository;
    @Autowired
    private MilestoneRepository milestoneRepository;


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
        // Save the project first
        Project savedProject = projectRepository.save(project);

        // Create default milestones for the saved project
        createDefaultMilestones(savedProject);

        return savedProject;
    }

    private void createDefaultMilestones(Project project) {
        // List of predefined milestone names
        List<String> milestoneNames = List.of(
                "Requirement Gathering",
                "Design Phase",
                "Development Phase",
                "First Prototype",
                "Testing Phase",
                "Deployment Phase"
        );

        // Create and save milestones
        for (String milestoneName : milestoneNames) {
            Milestone milestone = new Milestone();
            milestone.setName(milestoneName);
            milestone.setStatus(MilestoneStatus.PENDING);  // Default status is PENDING
            milestone.setProject(project);  // Associate the milestone with the project

            // Save the milestone to the repository (assuming you have a milestoneRepository)
            milestoneRepository.save(milestone);
        }
    }


    @Override
    public Project modifyProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public void removeProject(Long id) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) {
            throw new IllegalArgumentException("Project not found");
        }

        // Optional: Delete related milestones if necessary
        List<Milestone> milestones = project.getMilestones();
        // Delete the associated milestones
        milestoneRepository.deleteAll(milestones);

        projectRepository.deleteById(id);  // Delete the project
    }


    @Override
    public int calculateProjectProgress(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null || project.getMilestones().isEmpty()) {
            return 0; // No progress if no milestones exist
        }

        long completedMilestones = project.getMilestones().stream()
                .filter(milestone -> milestone.getStatus() == MilestoneStatus.COMPLETED)
                .count();

        return (int) ((completedMilestones * 100) / project.getMilestones().size());
    }
    @Override
    public Milestone updateMilestoneStatus(Long projectId, Long milestoneId, MilestoneStatus status) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            throw new IllegalArgumentException("Project not found");
        }

        Milestone milestone = milestoneRepository.findById(milestoneId).orElse(null);
        if (milestone == null || !milestone.getProject().getProjectId().equals(projectId)) {
            throw new IllegalArgumentException("Milestone not found or does not belong to this project");
        }

        milestone.setStatus(status);
        milestoneRepository.save(milestone);  // Save the updated milestone

        // Recalculate the progress after updating milestone status
        int progress = calculateProjectProgress(projectId);
        return milestone;
    }
    @Override
    public List<Project> searchProjects(String keyword) {
        return projectRepository.searchProjects(keyword);
    }
    @Override
    public List<ProjectStatisticsDTO> getProjectStatusStatistics() {
        List<Object[]> rawStats = projectRepository.getProjectStatusStatistics();

        return rawStats.stream()
                .map(row -> new ProjectStatisticsDTO((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());
    }


}

package tn.esprit.interlink_back.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.dtos.ProjectStatisticsDTO;
import tn.esprit.interlink_back.entity.Enums.MilestoneStatus;
import tn.esprit.interlink_back.entity.Enums.Role;
import tn.esprit.interlink_back.entity.Milestone;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.repository.MilestoneRepository;
import tn.esprit.interlink_back.repository.ProjectRepository;
import tn.esprit.interlink_back.services.EmailService;
import tn.esprit.interlink_back.services.IProjectService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements IProjectService {

    @Autowired
    private final ProjectRepository projectRepository;
    @Autowired
    private MilestoneRepository milestoneRepository;
    @Autowired
    private EmailService emailService;


    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public List<Project> retrieveAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project retrieveProject(Long projectId) {
        // Use the custom query to get the project with the company
        return projectRepository.findByProjectIdWithCompany(projectId);
    }

    @Override
    public Project addProject(Project project) {
        // 🔁 Enhance the description
        project.setDescription(enhanceDescription(project.getDescription()));

        // Save the project first
        Project savedProject = projectRepository.save(project);

        // Create default milestones
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

            milestoneRepository.save(milestone);
        }
    }

    private String enhanceDescription(String original) {
        if (original == null || original.isBlank()) return original;

        // ✨ Fake AI enhancement (replace later with real API)
        return "📌 [Enhanced] " + original.substring(0, 1).toUpperCase() + original.substring(1).trim()
                + ". This project aims to deliver outstanding results aligned with modern standards.";
    }
    public List<Project> getProjectsByUserIdAndRole(Long userId, Role role) {
        return projectRepository.findByUserIdAndRole(userId, role);
    }

    public Project getProjectByStudentId(Long userId, Role role) {
        List<Project> projects = projectRepository.findPByStudentId(userId, role);
        if (projects.isEmpty()) {
            return new Project();
        }
        // Return the first project if there are multiple
        return projects.get(0);
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

        int totalMilestones = project.getMilestones().size();
        double progressPoints = 0.0;

        for (Milestone milestone : project.getMilestones()) {
            if (milestone.getStatus() == MilestoneStatus.COMPLETED) {
                progressPoints += 1.0; // Full weight for completed
            } else if (milestone.getStatus() == MilestoneStatus.IN_PROGRESS) {
                progressPoints += 0.5; // Half weight for in progress
            }
            // PENDING gets 0 points
        }

        return (int) ((progressPoints / totalMilestones) * 100);
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

        // Save the old status to compare later
        MilestoneStatus oldStatus = milestone.getStatus();

        // Update the milestone status
        milestone.setStatus(status);
        milestoneRepository.save(milestone);  // Save the updated milestone

        // Check if the milestone status has changed
        // if (!oldStatus.equals(status)) {
        // Send an email to the static recipient when the status changes
        sendStatusUpdateEmail(project, milestone, oldStatus, status);
        //}

        // Recalculate the progress after updating milestone status
        int progress = calculateProjectProgress(projectId);
        return milestone;
    }
    @Override
    public boolean sendStatusUpdateEmail(Project project, Milestone milestone, MilestoneStatus oldStatus, MilestoneStatus newStatus) {
        // Calculate the project progress after the milestone status update
        int progress = calculateProjectProgress(project.getProjectId());

        // Compose the subject and body of the email
        String subject = "Milestone Status Update for Project: " + project.getTitle();
        String body = String.format("Hello, \n\n" +
                        "The status of the milestone '%s' for the project '%s' has been updated from '%s' to '%s'.\n\n" +
                        "Current project progress: %d%%.\n\n" +
                        "Best regards, \nYour Project Management Team",
                milestone.getName(), project.getTitle(), oldStatus, newStatus, progress);

        // Send the email using the email service
        boolean emailSent = emailService.sendEmail(subject, body);

        if (!emailSent) {
            System.out.println("Failed to send milestone status update email.");
        }

        return emailSent;
    }
    @Override
    public void sendStatusUpdateEmail(Project project, MilestoneStatus oldStatus, MilestoneStatus newStatus) {
        String subject = "Project Status Update";
        String body = String.format("Hello, \n\nThe status of the project '%s' has been updated from '%s' to '%s'.\n\nBest regards, \nYour Project Management Team",
                project.getTitle(), oldStatus, newStatus);

        // Send the email to the static recipient
        emailService.sendEmail(subject, body);
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

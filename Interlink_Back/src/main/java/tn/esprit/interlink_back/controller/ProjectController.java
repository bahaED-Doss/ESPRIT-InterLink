package tn.esprit.interlink_back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.service.IProjectService;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final IProjectService projectService;

    public ProjectController(IProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/retrieve-all-projects")
    public List<Project> getAllProjects() {
        return projectService.retrieveAllProjects();
    }

    @GetMapping("/project-by-id/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long projectId) {
        Project project = projectService.retrieveProject(projectId);
        return project != null ? ResponseEntity.ok(project) : ResponseEntity.notFound().build();
    }

    @PostMapping("/add-project")
    public Project createProject(@RequestBody Project project) {
        // Process technologiesUsed if needed (convert list to string, for example)
        return projectService.addProject(project);
    }

    @PutMapping("/modify-project/{projectId}")
    public ResponseEntity<Project> updateProject(@PathVariable Long projectId, @RequestBody Project projectDetails) {
        Project existingProject = projectService.retrieveProject(projectId);
        if (existingProject == null) {
            return ResponseEntity.notFound().build();
        }

        // Update project fields
        existingProject.setTitle(projectDetails.getTitle());
        existingProject.setDescription(projectDetails.getDescription());
        existingProject.setStartDate(projectDetails.getStartDate());
        existingProject.setEndDate(projectDetails.getEndDate());
        existingProject.setStatus(projectDetails.getStatus());

        // Handle technologiesUsed as comma-separated string
        if (projectDetails.getTechnologiesUsed() != null && !projectDetails.getTechnologiesUsed().isEmpty()) {
            existingProject.setTechnologiesUsed(String.join(",", projectDetails.getTechnologiesUsed()));
        }

        return ResponseEntity.ok(projectService.modifyProject(existingProject));
    }

    @DeleteMapping("/remove-project/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.removeProject(id);
        return ResponseEntity.ok().build();
    }
}

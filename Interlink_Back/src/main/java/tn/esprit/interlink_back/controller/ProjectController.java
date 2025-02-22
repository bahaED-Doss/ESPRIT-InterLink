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

    @GetMapping("/project-by-id/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = projectService.retrieveProject(id);
        return project != null ? ResponseEntity.ok(project) : ResponseEntity.notFound().build();
    }

    @PostMapping("/add-project")
    public Project createProject(@RequestBody Project project) {
        return projectService.addProject(project);
    }

    @PutMapping("/modify-project/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        Project existingProject = projectService.retrieveProject(id);
        if (existingProject == null) {
            return ResponseEntity.notFound().build();
        }

        // Update project details and save
        existingProject.setTitle(projectDetails.getTitle());
        existingProject.setDescription(projectDetails.getDescription());
        existingProject.setStartDate(projectDetails.getStartDate());
        existingProject.setEndDate(projectDetails.getEndDate());
        existingProject.setStatus(projectDetails.getStatus());
        existingProject.setTechnologiesUsed(projectDetails.getTechnologiesUsed());

        return ResponseEntity.ok(projectService.modifyProject(existingProject));
    }

    @DeleteMapping("/remove-project/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.removeProject(id);
        return ResponseEntity.ok().build();
    }
}

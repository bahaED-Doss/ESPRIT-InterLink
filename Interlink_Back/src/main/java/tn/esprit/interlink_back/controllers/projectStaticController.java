package tn.esprit.interlink_back.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.services.ProjectStaticService;
import tn.esprit.interlink_back.entity.Enums.Role;
import tn.esprit.interlink_back.entity.User;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class projectStaticController {

    @Autowired
    private ProjectStaticService projectStaticService;

    @GetMapping("/users/{userId}/projects")
    public List<Project> getProjectsByUserIdAndRole(@PathVariable Long userId) {
        return projectStaticService.getProjectsByUserIdAndRole(userId, Role.PROJECT_MANAGER);
    }
    @GetMapping("/users/{userId}/project")
    public ResponseEntity<Project> getProjectByStudentId(@PathVariable Long userId) {
        try {
            Project project = projectStaticService.getProjectByStudentId(userId, Role.STUDENT);
            if (project.getProjectId() == null) {
                // Return empty project with 200 OK status instead of null
                return ResponseEntity.ok(new Project());
            }
            return ResponseEntity.ok(project);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error getting project for student " + userId + ": " + e.getMessage());
            // Return an empty project with 200 OK status instead of throwing an error
            return ResponseEntity.ok(new Project());
        }
    }

}

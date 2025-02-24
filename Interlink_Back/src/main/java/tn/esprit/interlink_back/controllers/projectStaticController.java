package tn.esprit.interlink_back.controllers;

import org.springframework.beans.factory.annotation.Autowired;
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
}

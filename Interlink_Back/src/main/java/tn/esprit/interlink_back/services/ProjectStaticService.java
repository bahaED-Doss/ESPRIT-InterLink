package tn.esprit.interlink_back.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Enums.Role;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.ProjectRepository;

import java.util.List;

@Service
public class ProjectStaticService {

    @Autowired
    private ProjectRepository projectRepository;

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
}
package tn.esprit.interlink_back.service;

import tn.esprit.interlink_back.entity.Enums.MilestoneStatus;
import tn.esprit.interlink_back.entity.Milestone;
import tn.esprit.interlink_back.entity.Project;

import java.util.List;

public interface IProjectService {
    List<Project> retrieveAllProjects();
    Project retrieveProject(Long id);
    Project addProject(Project project);
    Project modifyProject(Project project);
    void removeProject(Long id);

    int calculateProjectProgress(Long projectId);

    Milestone updateMilestoneStatus(Long projectId, Long milestoneId, MilestoneStatus status);
}

package tn.esprit.interlink_back.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Enums.Role;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.UserRepository;

import java.util.List;
import java.util.Optional;
@Service

public class statticUserServiceTasks {
    @Autowired
    private UserRepository userRepository;

    public List<User> getProjectManagers() {
        return userRepository.findByRole(Role.PROJECT_MANAGER);
    }}
  //  public List<User> getstudents() {
    //    return userRepository.findByRole(Role.STUDENT);
    //}
    // public Project getStudentProject(Long studentId) {
     //   User student = userRepository.findById(studentId)
       //         .orElseThrow(() -> new RuntimeException("Student not found"));
        //return student.getProject();}}


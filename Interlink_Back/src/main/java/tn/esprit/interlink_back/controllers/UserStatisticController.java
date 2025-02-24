package tn.esprit.interlink_back.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.services.statticUserServiceTasks;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")

public class UserStatisticController {

    @Autowired
    private statticUserServiceTasks userStatisticService;

    @GetMapping("/project-managers")
    public List<User> getAllProjectManagers() {
        return userStatisticService.getProjectManagers();
    }



}
package tn.esprit.interlink_back.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Application;
import tn.esprit.interlink_back.services.ApplicationServiceImpl;
import tn.esprit.interlink_back.services.IApplicationService;
import tn.esprit.interlink_back.services.ApplicationServiceImpl;
import tn.esprit.interlink_back.services.IApplicationService;

import java.util.List;

@RestController
@RequestMapping("/application")
public class ApplicationController {
    IApplicationService applicationService;
    @Autowired
    public ApplicationController(ApplicationServiceImpl applicationService) {
        this.applicationService = applicationService;
    }

    // http://localhost:8081/foyer/application/retrieve-all-applications
    @GetMapping("/retrieve-all-applications")
    public List<Application> getApplications() {
        List<Application> listApplications = applicationService.allApplication();
        return listApplications;
    }

    // http://localhost:8081/foyer/application/retrieve-application/8
    @GetMapping("/retrieve-application/{application-id}")
    public Application retrieveApplication(@PathVariable("application-id") Long appId) {
        Application application = applicationService.findApplicationById(appId);
        return application;
    }

    // http://localhost:8081/foyer/application/add-application
    @PostMapping("/add-application")
    public Application addApplication(@RequestBody Application a) {
        Application application = applicationService.addApplication(a);
        return application;

    }

    // http://localhost:8081/foyer/application/remove-application/{application-id}
    @DeleteMapping("/remove-application/{application-id}")
    public void removeApplication(@PathVariable("application-id") Long appId) {
        applicationService.deleteApplication(appId);
    }

    // http://localhost:8081/foyer/application/modify-application
    @PutMapping("/modify-application")
    public Application modifyApplication(@RequestBody Application a) {
        Application application = applicationService.updateApplication(a);
        return application;
    }
}

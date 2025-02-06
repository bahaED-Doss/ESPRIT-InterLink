package tn.esprit.interlink_back.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.ProjectManager;
import tn.esprit.interlink_back.repository.ProjectManagerRepository;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
public class ProjectManagerController {

    private final ProjectManagerRepository managerRepository;

    public ProjectManagerController(ProjectManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    @GetMapping("/retrieve-all-managers")
    public List<ProjectManager> getAllManagers() {
        return managerRepository.findAll();
    }

    @PostMapping("/add-manager")
    public ProjectManager createManager(@RequestBody ProjectManager manager) {
        return managerRepository.save(manager);
    }

    @GetMapping("/manager-by-id/{id}")
    public ResponseEntity<ProjectManager> getManagerById(@PathVariable Long id) {
        return managerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/modify-manager/{id}")
    public ResponseEntity<ProjectManager> updateManager(@PathVariable Long id, @RequestBody ProjectManager managerDetails) {
        return managerRepository.findById(id)
                .map(manager -> {
                    return ResponseEntity.ok(managerRepository.save(manager));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/remove-manager/{id}")
    public ResponseEntity<?> deleteManager(@PathVariable Long id) {
        managerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}


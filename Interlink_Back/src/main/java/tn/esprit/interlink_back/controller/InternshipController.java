package tn.esprit.interlink_back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Internship;
import tn.esprit.interlink_back.service.InternshipServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
public class InternshipController {

    private final InternshipServiceImpl internshipService;
@Autowired
    public InternshipController(InternshipServiceImpl internshipService) {
        this.internshipService = internshipService;
    }


    @GetMapping("/retrieve-all-internships")
    public List<Internship> getAllInternships() {
        return internshipService.getAllInternships();
    }

    @PostMapping("/add-internship")
    public Internship createInternship(@RequestBody Internship internship) {
        return internshipService.createInternship(internship);
    }

    @GetMapping("/internship-by-id/{id}")
    public ResponseEntity<Internship> getInternshipById(@PathVariable Long id) {
        return internshipService.getInternshipById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
 @PutMapping("/modify-internship")
    public Internship modifyInternship(@RequestBody Internship i) {
        Internship internship = internshipService.updateInternship(i);
        return internship;
    }

    @DeleteMapping("/remove-internship/{id}")
        public void deleteInternship(@PathVariable("internship-id") Long intId) {//@requestbody a5ater fma variable fi parametre
       internshipService.deleteInternship(intId);
    
    }
}

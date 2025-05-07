package tn.esprit.interlink_back.controllers.UserC;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Education;
import tn.esprit.interlink_back.services.UserS.EducationService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/education")
public class EducationController {

    @Autowired
    private EducationService educationService;

    // POST: Add new education for a specific user
    @PostMapping("/add/{userId}")
    public ResponseEntity<Education> addEducation(@PathVariable Long userId,
                                                  @RequestBody Education education) {
        Education saved = educationService.addEducation(userId, education);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // GET: Retrieve all education items for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Education>> getUserEducation(@PathVariable Long userId) {
        List<Education> educations = educationService.getEducationByUser(userId);
        return ResponseEntity.ok(educations);
    }

    // PUT: Update an existing education record
    @PutMapping("/update")
    public ResponseEntity<Education> updateEducation(@RequestBody Education education) {
        Education updated = educationService.updateEducation(education);
        return ResponseEntity.ok(updated);
    }

    // DELETE: Remove an education record
    @DeleteMapping("/{educationId}")
    public ResponseEntity<?> deleteEducation(@PathVariable Long educationId) {
        educationService.deleteEducation(educationId);
        return ResponseEntity.ok("Education deleted successfully");
    }
}
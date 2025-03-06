package tn.esprit.interlink_back.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Interview;
import tn.esprit.interlink_back.entity.Reponse;
import tn.esprit.interlink_back.service.InterviewService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "http://localhost:4200")
    public class InterviewController {

    final InterviewService interviewService;
    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    // Ajouter un entretien
    @PostMapping("/add")
    public ResponseEntity<Interview> addInterview(@RequestBody Interview interview) {
        Interview savedInterview = interviewService.addInterview(interview);
        return ResponseEntity.ok(savedInterview);
    }

    // Récupérer tous les entretiens
    @GetMapping("/all")
    public ResponseEntity<List<Interview>> getAllInterviews() {
        List<Interview> interviews = interviewService.getAllInterviews();
        return ResponseEntity.ok(interviews);
    }

    // Récupérer un entretien par ID
    @GetMapping("/{id}")
    public ResponseEntity<Interview> getInterviewById(@PathVariable int id) {
        Optional<Interview> interview = interviewService.getInterviewById(id);
        return interview.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Mettre à jour un entretien
    @PutMapping("/update/{id}")
    public ResponseEntity<Interview> updateInterview(@PathVariable int id, @RequestBody Interview newInterview) {
        try {
            Interview updatedInterview = interviewService.updateInterview(id, newInterview);
            return ResponseEntity.ok(updatedInterview);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un entretien
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable int id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/getRang/{id}")
    public ResponseEntity<String> getRangAndPercent(@PathVariable int id) {

        return ResponseEntity.ok(interviewService.affichePercentAndRage(id));
    }

}

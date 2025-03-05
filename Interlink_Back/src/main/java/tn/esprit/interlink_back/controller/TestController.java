package tn.esprit.interlink_back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Interview;
import tn.esprit.interlink_back.entity.Test;
import tn.esprit.interlink_back.service.TestService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:4200")
public class TestController {
    
    public TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @PostMapping("/add")
    public ResponseEntity<Test> addTest(@RequestBody Test test) {
        Test savedTest = testService.addTest(test);
        return ResponseEntity.ok(savedTest);
    }

    // Récupérer tous les entretiens
    @GetMapping("/all")
    public ResponseEntity<List<Test>> getAllTests() {
        List<Test> Tests = testService.getAllTests();
        return ResponseEntity.ok(Tests);
    }

    // Récupérer un entretien par ID
    @GetMapping("/{id}")
    public ResponseEntity<Test> getTestById(@PathVariable int id) {
        Optional<Test> test = testService.getTestById(id);
        return test.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Mettre à jour un entretien
    @PutMapping("/update/{id}")
    public ResponseEntity<Test> updateTest(@PathVariable int id, @RequestBody Test newTest) {
        try {
            Test updatedTest = testService.updateTest(id, newTest);
            return ResponseEntity.ok(updatedTest);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un entretien
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTest(@PathVariable int id) {
        testService.deleteTest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Test>> getAllByParam(@RequestParam String param) {
        List<Test> interviews = testService.getAllSearch(param);
        return ResponseEntity.ok(interviews);
    }
}

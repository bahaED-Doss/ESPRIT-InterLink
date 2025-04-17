package tn.esprit.interlink_back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Question;
import tn.esprit.interlink_back.service.QuestionService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/question")
@CrossOrigin(origins = "http://localhost:4200")
public class QuesionController {

    public final QuestionService questionService;

    public QuesionController(QuestionService questionService) {
        this.questionService = questionService;
    }


    @PostMapping("/add")
    public ResponseEntity<Question> addQuestion(@RequestBody Question question) {
        Question savedQuest = questionService.addQuestion(question);
        return ResponseEntity.ok(savedQuest);
    }


    @GetMapping("/getAllByTest/{id}")
    public ResponseEntity<List<Question>> getAllQuestions(@PathVariable Long id) {
        List<Question> questions = questionService.getAllByTest(id);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable int id) {
        Optional<Question> question = questionService.getQuestionById(id);
        return question.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Mettre à jour un entretien
    @PutMapping("/update/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable int id, @RequestBody Question newQuestion) {
        try {
            Question updatedQuestion = questionService.updateQuestion(id, newQuestion);
            return ResponseEntity.ok(updatedQuestion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un entretien
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable int id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}

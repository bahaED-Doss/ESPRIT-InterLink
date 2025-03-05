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
    public ResponseEntity<Question> addTest(@RequestBody Question question) {
        Question savedQuest = questionService.addQuestion(question);
        return ResponseEntity.ok(savedQuest);
    }


    @GetMapping("/{id}")
    public ResponseEntity<List<Question>> getAllTests(@PathVariable Long id) {
        List<Question> questions = questionService.getAllByTest(id);
        return ResponseEntity.ok(questions);
    }
}

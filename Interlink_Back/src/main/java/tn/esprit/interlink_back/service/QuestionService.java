package tn.esprit.interlink_back.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Question;
import tn.esprit.interlink_back.repository.QuestionRepository;

import java.util.List;
import java.util.Optional;

@Service

public class QuestionService
{
    private final QuestionRepository questionRepository;
    public QuestionService(QuestionRepository questionRepository)
    {
        this.questionRepository = questionRepository;
    }
    // Ajouter une question
    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    // Récupérer toutes les questions
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // Récupérer une question par ID
    public Optional<Question> getQuestionById(int id) {
        return questionRepository.findById(id);
    }

    // Mettre à jour une question
    public Question updateQuestion(int id, Question newQuestion) {
        return questionRepository.findById(id).map(question -> {
            question.setContenu(newQuestion.getContenu());
            question.setReponse(newQuestion.getReponse());
            question.setEvaluation(newQuestion.getEvaluation());
            return questionRepository.save(question);
        }).orElseThrow(() -> new RuntimeException("Question avec ID " + id + " non trouvée"));
    }

    // Supprimer une question
    public void deleteQuestion(int id) {
        questionRepository.deleteById(id);
    }


}

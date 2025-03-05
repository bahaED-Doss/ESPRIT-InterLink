package tn.esprit.interlink_back.service;

import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Test;
import tn.esprit.interlink_back.repository.TestRepository;

import java.util.List;
import java.util.Optional;
@Service
public class TestService
{
    private final TestRepository testRepository;
    public TestService(TestRepository testRepository)
    {
        this.testRepository = testRepository;
    }
    // Ajouter un test
    public Test addTest(Test test) {
        return testRepository.save(test);
    }
    // Récupérer tous les tests
    public List<Test> getAllTests() {
        return testRepository.findAll();
    }
    // Récupérer un test par ID
    public Optional<Test> getTestById(int id) {
        return testRepository.findById(id);
    }
    // update un test
    public Test updateTest(int id, Test newTest) {
        return testRepository.findById(id).map(test -> {
            test.setTypeTest(newTest.getTypeTest());
            test.setNote(newTest.getNote());
            return testRepository.save(test);
        }).orElseThrow(() -> new RuntimeException("Test avec ID " + id + " non trouvé"));
    }
    // Supprimer un test
    public void deleteTest(int id) {
        testRepository.deleteById(id);
    }

    public List<Test> getAllSearch(String param) {
        return testRepository.search(param);
    }

}

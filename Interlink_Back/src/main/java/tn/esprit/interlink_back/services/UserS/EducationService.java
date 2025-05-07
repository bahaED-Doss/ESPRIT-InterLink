package tn.esprit.interlink_back.services.UserS;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Education;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.EducationRepository;
import tn.esprit.interlink_back.repository.UserRepository;

import java.util.List;

@Service
public class EducationService {

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private UserRepository userRepository;

    public Education addEducation(Long userId, Education education) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        education.setUser(user);
        return educationRepository.save(education);
    }

    public List<Education> getEducationByUser(Long userId) {
        // For example, you can fetch all, then filter:
        return educationRepository.findAll()
                .stream()
                .filter(e -> e.getUser().getId().equals(userId))
                .toList();
    }

    // Or you can create a custom query in EducationRepository to find by user ID
    // e.g. List<Education> findByUserId(Long userId);

    public void deleteEducation(Long educationId) {
        educationRepository.deleteById(educationId);
    }

    public Education updateEducation(Education updated) {
        // Just a simple update, or you can do more logic
        return educationRepository.save(updated);
    }
}
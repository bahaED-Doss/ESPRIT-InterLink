package tn.esprit.interlink_back.services.UserS;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Skill;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.SkillRepository;
import tn.esprit.interlink_back.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserRepository userRepository;

    public Skill addSkill(Long userId, Skill skill) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        skill.setUser(user);
        return skillRepository.save(skill);
    }

    public List<Skill> getSkillsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new ArrayList<>(user.getSkills());
    }
}
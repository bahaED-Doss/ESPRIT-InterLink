package tn.esprit.interlink_back.controllers.UserC;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Skill;
import tn.esprit.interlink_back.services.UserS.SkillService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping("/api")
public class SkillController {


    @Autowired
    private SkillService skillService;

    @PostMapping("/skills/add/{userId}")
    public ResponseEntity<Skill> addSkill(@PathVariable Long userId, @RequestBody Skill skill) {
        Skill addedSkill = skillService.addSkill(userId, skill);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedSkill);
    }

    @GetMapping("/skills/{userId}")
    public ResponseEntity<List<Skill>> getSkills(@PathVariable Long userId) {
        List<Skill> skills = skillService.getSkillsByUserId(userId);
        return ResponseEntity.ok(skills);
    }
}
package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.esprit.interlink_back.entity.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
}

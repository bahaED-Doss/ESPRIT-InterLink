package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.interlink_back.entity.Trophy;

public interface TrophyRepository extends JpaRepository<Trophy, Long> {
}

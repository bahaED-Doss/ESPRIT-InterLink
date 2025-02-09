package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.interlink_back.entity.Medal;

public interface MedalRepository extends JpaRepository<Medal, Long> {
}

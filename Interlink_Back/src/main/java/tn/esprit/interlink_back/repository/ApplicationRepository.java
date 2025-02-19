package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.interlink_back.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application,Long> {
}

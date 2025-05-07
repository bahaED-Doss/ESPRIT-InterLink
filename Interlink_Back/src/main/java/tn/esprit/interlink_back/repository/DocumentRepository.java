package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Documentt;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Documentt, Long> {
    List<Documentt> findByUserId(Long userId);
}
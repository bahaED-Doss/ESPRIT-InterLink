package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
}


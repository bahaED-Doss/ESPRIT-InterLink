package tn.esprit.interlink_back.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Company;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    // For HR-Company relationship
    Optional<Company> findByEmail(String email);
    
    // For company search functionality
    @Query("SELECT c FROM Company c WHERE " +
            "(:industrySector = '' OR c.industrySector = :industrySector) AND " +
            "(:location = '' OR c.location = :location)")
    List<Company> searchCompanies(@Param("industrySector") String industrySector,
                                @Param("location") String location,
                                Sort sort);
    
    // For statistics
    @Query("SELECT c.industrySector, COUNT(c) FROM Company c GROUP BY c.industrySector")
    List<Object[]> countCompaniesByIndustrySector();
    
    // For project statistics
    @Query("SELECT c.name, SIZE(c.projects) FROM Company c")
    List<Object[]> countProjectsPerCompany();

    Optional<Company> findByEmployeesEmail(String email);
    Optional<Company> findByEmployeesId(Long userId);
}


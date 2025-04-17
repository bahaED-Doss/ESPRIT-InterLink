package tn.esprit.interlink_back.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Company;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    // Search for companies based on criteria and support sorting
    @Query("SELECT c FROM Company c WHERE " +
            "(:industrySector = '' OR c.industrySector = :industrySector) AND " +
            "(:location = '' OR c.location = :location)")
    List<Company> searchCompanies(@Param("industrySector") String industrySector,
                                  @Param("location") String location,
                                  Sort sort);

}


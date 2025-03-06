package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Test;

import java.util.List;
@Repository
public interface TestRepository extends JpaRepository<Test, Integer>
{

    @Query(value = "SELECT t.* FROM test t WHERE t.type_test LIKE CONCAT('%', :param, '%') OR t.titre LIKE CONCAT('%', :param, '%') ORDER BY t.titre ASC", nativeQuery = true)
    List<Test> search(@Param("param") String param);

}

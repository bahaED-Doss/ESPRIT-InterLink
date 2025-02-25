package tn.esprit.interlink_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.interlink_back.entity.PasswordResetToken;

public interface TokenRepository extends JpaRepository<PasswordResetToken, Integer> {

    PasswordResetToken findByToken(String token);

}

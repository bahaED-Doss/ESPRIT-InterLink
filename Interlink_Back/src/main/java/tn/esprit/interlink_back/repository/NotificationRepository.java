package tn.esprit.interlink_back.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.interlink_back.entity.Notification;
import tn.esprit.interlink_back.entity.User;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientOrderByTimestampDesc(User recipient);
    List<Notification> findByRecipientAndIsReadFalseOrderByTimestampDesc(User recipient);
    long countByRecipientAndIsReadFalse(User recipient);
}
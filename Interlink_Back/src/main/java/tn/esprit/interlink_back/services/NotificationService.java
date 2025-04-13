package tn.esprit.interlink_back.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.DTO.NotificationDTO;
import tn.esprit.interlink_back.entity.Notification;
import tn.esprit.interlink_back.entity.Enums.NotificationType;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.NotificationRepository;
import tn.esprit.interlink_back.repository.UserRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all notifications for a user
    public List<NotificationDTO> getNotificationsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<Notification> notifications = notificationRepository.findByRecipientOrderByTimestampDesc(user);

        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Create a new notification
    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        try {
            System.out.println("Creating notification: " + notificationDTO);
            
            Notification notification = new Notification();

            // Validate that sender and recipient are different users if sender is provided
            if (notificationDTO.getSenderId() != null && 
                notificationDTO.getSenderId().equals(notificationDTO.getUserId())) {
                throw new RuntimeException("Sender and recipient cannot be the same user");
            }

            // Set basic properties
            notification.setType(NotificationType.valueOf(notificationDTO.getType()));
            notification.setTaskId(notificationDTO.getTaskId());
            notification.setTaskTitle(notificationDTO.getTaskTitle());
            notification.setMessage(notificationDTO.getMessage());
            notification.setTimestamp(new Date());
            notification.setRead(false);

            // Set recipient
            User recipient = userRepository.findById(notificationDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("Recipient not found with id: " + notificationDTO.getUserId()));
            notification.setRecipient(recipient);

            // Set sender if available
            if (notificationDTO.getSenderId() != null) {
                User sender = userRepository.findById(notificationDTO.getSenderId())
                        .orElseThrow(() -> new RuntimeException("Sender not found with id: " + notificationDTO.getSenderId()));
                notification.setSender(sender);
            }

            // Set feedback ID if available
            if (notificationDTO.getFeedbackId() != null) {
                notification.setFeedbackId(notificationDTO.getFeedbackId());
            }

            // Save the notification
            Notification savedNotification = notificationRepository.save(notification);
            System.out.println("Notification saved successfully: " + savedNotification.getId());

            return convertToDTO(savedNotification);
        } catch (Exception e) {
            System.err.println("Error creating notification: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // Mark a notification as read
    public void markAsRead(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            // Make sure this matches your entity field name
            notification.setRead(true);  // or notification.setIsRead(true) if your field is named isRead
            notificationRepository.save(notification);
        } else {
            throw new RuntimeException("Notification not found with id: " + notificationId);
        }
    }

    // Mark all notifications as read for a user
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Make sure this repository method matches your entity field name
        List<Notification> unreadNotifications = notificationRepository.findByRecipientAndIsReadFalseOrderByTimestampDesc(user);

        unreadNotifications.forEach(notification -> {
            // Make sure this matches your entity field name
            notification.setRead(true);  // or notification.setIsRead(true) if your field is named isRead
            notificationRepository.save(notification);
        });
    }

    // Get unread count for a user
    public long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    // Helper method to convert entity to DTO
    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();

        dto.setId(notification.getId());
        dto.setType(notification.getType().name());
        dto.setTaskId(notification.getTaskId());
        dto.setTaskTitle(notification.getTaskTitle());
        dto.setMessage(notification.getMessage());
        dto.setTimestamp(notification.getTimestamp());
        dto.setRead(notification.isRead());

        if (notification.getRecipient() != null) {
            dto.setUserId(notification.getRecipient().getId());
        }

        if (notification.getSender() != null) {
            dto.setSenderId(notification.getSender().getId());
        }

        dto.setFeedbackId(notification.getFeedbackId());

        return dto;
    }
}
package tn.esprit.interlink_back.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.DTO.NotificationDTO;
import tn.esprit.interlink_back.services.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Get all notifications for a user
    @GetMapping("/users/{userId}/notifications")
    public ResponseEntity<List<NotificationDTO>> getNotificationsForUser(@PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationService.getNotificationsForUser(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    // Create a new notification
    @PostMapping("/notifications")
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
        NotificationDTO createdNotification = notificationService.createNotification(notificationDTO);
        return new ResponseEntity<>(createdNotification, HttpStatus.CREATED);
    }
    
    // Create a notification from one user to another
    @PostMapping("/users/{senderId}/notifications/to/{recipientId}")
    public ResponseEntity<NotificationDTO> createNotificationBetweenUsers(
            @PathVariable Long senderId,
            @PathVariable Long recipientId,
            @RequestBody NotificationDTO notificationDTO) {
        
        // Set the sender and recipient IDs from the path variables
        notificationDTO.setSenderId(senderId);
        notificationDTO.setUserId(recipientId);
        
        NotificationDTO createdNotification = notificationService.createNotification(notificationDTO);
        return new ResponseEntity<>(createdNotification, HttpStatus.CREATED);
    }

    // Mark a notification as read
    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Mark all notifications as read for a user
    @PutMapping("/users/{userId}/notifications/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Get unread count for a user
    @GetMapping("/users/{userId}/notifications/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        long unreadCount = notificationService.getUnreadCount(userId);
        return new ResponseEntity<>(unreadCount, HttpStatus.OK);
    }
}
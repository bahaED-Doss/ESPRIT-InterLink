package tn.esprit.interlink_back.services;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Task;

@Service

public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendTaskNotification(Task task) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(task.getStudent().getEspritEmail());
        message.setSubject("New Task Assigned: " + task.getTitle());
        message.setText("Hello " + task.getStudent().getFirstName() + ",\n\n" +
                "A new task has been assigned to you.\n" +
                "Title: " + task.getTitle() + "\n" +
                "Description: " + task.getDescription() + "\n" +
                "Deadline: " + task.getDeadline() + "\n\n" +
                "Please check your calendar for details.\n\n" +
                "Best regards,\nTask Management System");

        mailSender.send(message);
    }
}
package tn.esprit.interlink_back.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Task;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    // Static email address from application properties or hardcoded
    @Value("${email.static.recipient}")
    private String staticRecipientEmail;

    public boolean sendEmail(String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(staticRecipientEmail); // Always send to static recipient
            message.setSubject(subject);
            message.setText(body);
            emailSender.send(message);
            return true; // Return true if the email is sent successfully
        } catch (MailException e) {
            // Handle the failure (log or rethrow exception if necessary)
            System.out.println("Error sending email: " + e.getMessage());
            return false; // Return false if email sending failed
        }
    }



    public void sendTaskNotification(Task task) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(task.getStudent().getEmail());
        message.setSubject("New Task Assigned: " + task.getTitle());
        message.setText("Hello " + task.getStudent().getFirstName() + ",\n\n" +
                "A new task has been assigned to you.\n" +
                "Title: " + task.getTitle() + "\n" +
                "Description: " + task.getDescription() + "\n" +
                "Deadline: " + task.getDeadline() + "\n\n" +
                "Please check your calendar for details.\n\n" +
                "Best regards,\nTask Management System");

        emailSender.send(message);
    }
}

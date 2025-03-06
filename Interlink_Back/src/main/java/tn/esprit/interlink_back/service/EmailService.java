package tn.esprit.interlink_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    // Static email address from application properties or hardcoded
    @Value("${email.static.recipient}")
    private String staticRecipientEmail;

    public void sendEmail(String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(staticRecipientEmail); // Always send to static recipient
        message.setSubject(subject);
        message.setText(body);
        emailSender.send(message);
    }
}

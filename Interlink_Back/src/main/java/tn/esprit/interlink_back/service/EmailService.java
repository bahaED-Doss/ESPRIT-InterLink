package tn.esprit.interlink_back.service;

import com.itextpdf.text.log.Logger;
import com.itextpdf.text.log.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

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
}

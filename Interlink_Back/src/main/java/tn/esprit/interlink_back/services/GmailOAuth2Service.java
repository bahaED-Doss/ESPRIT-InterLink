package tn.esprit.interlink_back.services;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.Base64;
import javax.annotation.PostConstruct;


import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.services.gmail.model.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;


import javax.annotation.PostConstruct;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

@Service
public class GmailOAuth2Service {

    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList(GmailScopes.GMAIL_SEND);

    @Value("${google.oauth2.credentials-file}")
    private Resource credentialsFile;

    @Value("${google.oauth2.tokens-directory}")
    private String tokensDirectory;

    @Value("${google.oauth2.user-email}")
    private String userEmail;

    private Gmail gmailService;


    @PostConstruct
    public void init() throws GeneralSecurityException, IOException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        gmailService = new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
                .setApplicationName("Gmail OAuth2")
                .build();
    }

    private Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new FileReader(credentialsFile.getFile()));

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new File(tokensDirectory)))
                .setAccessType("offline")
                .build();

        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
        return new AuthorizationCodeInstalledApp(flow, receiver).authorize(userEmail);
    }

    public void sendEmail(String toEmail, String subject, String htmlBody) throws IOException, MessagingException {
        System.out.println("Sending email to: " + toEmail);
        System.out.println("Subject: " + subject);
        System.out.println("Body: " + htmlBody);

        Message message = createMessageWithHtmlContent(toEmail, subject, htmlBody);
        gmailService.users().messages().send(userEmail, message).execute();

        System.out.println("Email sent successfully.");
    }
    private Message createMessageWithHtmlContent(String toEmail, String subject, String htmlBody) throws MessagingException, IOException {
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);

        MimeMessage email = new MimeMessage(session);
        email.setFrom(new InternetAddress(userEmail));
        email.addRecipient(jakarta.mail.Message.RecipientType.TO, new InternetAddress(toEmail));
        email.setSubject(subject);

        // Set the email content to HTML
        email.setContent(htmlBody, "text/html");

        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        email.writeTo(buffer);
        byte[] bytes = buffer.toByteArray();
        String encodedEmail = Base64.getUrlEncoder().encodeToString(bytes);

        Message message = new Message();
        message.setRaw(encodedEmail);
        return message;
    }

    private Message createMessage(String toEmail, String subject, String body) throws MessagingException, IOException {
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);

        MimeMessage email = new MimeMessage(session);
        email.setFrom(new InternetAddress(userEmail));
        email.addRecipient(jakarta.mail.Message.RecipientType.TO, new InternetAddress(toEmail));
        email.setSubject(subject);
        email.setText(body);

        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        email.writeTo(buffer);
        byte[] bytes = buffer.toByteArray();
        String encodedEmail = Base64.getUrlEncoder().encodeToString(bytes);

        Message message = new Message();
        message.setRaw(encodedEmail);
        return message;
    }
}
package tn.esprit.interlink_back.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;

@Configuration
public class GoogleCalendarConfig {

    @Bean
    public Calendar calendarService() throws Exception {
        InputStream credentialsStream = new ClassPathResource("bionic-harbor-457016-t8-7e6460d3224f.json").getInputStream();
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream)
                .createScoped(java.util.Collections.singleton("https://www.googleapis.com/auth/calendar"));
        return new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials))
                .setApplicationName("Interlink Meet")
                .build();
    }
}
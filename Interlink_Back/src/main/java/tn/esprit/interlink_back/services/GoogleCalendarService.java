package tn.esprit.interlink_back.services;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.util.Date;
import com.google.api.services.calendar.model.EventReminder;




import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.TimeZone;

@Service
public class GoogleCalendarService {
    private static final String APPLICATION_NAME = "Task Management System";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    public void addEventToStudentCalendar(String studentEmail, String taskTitle, String description, Date deadline) throws Exception {
        Credential credential = getCredentials();
        Calendar service = new Calendar.Builder(GoogleNetHttpTransport.newTrustedTransport(), JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();

        Event event = new Event()
                .setSummary(taskTitle)
                .setDescription(description);

        EventDateTime eventDateTime = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(deadline))
                .setTimeZone(TimeZone.getDefault().getID());

        event.setStart(eventDateTime);
        event.setEnd(eventDateTime);

        // Set a reminder 2 days before the deadline
        event.setReminders(new Event.Reminders().setUseDefault(false)
                .setOverrides(Collections.singletonList(
                        new EventReminder().setMethod("popup").setMinutes(2880) // 2880 min = 2 days
                ))
        );

        service.events().insert("primary", event).execute();
    }

    private Credential getCredentials() throws Exception {
        InputStream in = new ClassPathResource("credentials.json").getInputStream();
        return GoogleCredential.fromStream(in)
                .createScoped(Arrays.asList("https://www.googleapis.com/auth/calendar.events"));
    }
}

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
import com.google.api.services.calendar.model.Events;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import com.google.api.services.calendar.model.EventReminder;




import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.TimeZone;
import java.util.logging.Logger;

@Service
public class GoogleCalendarService {
    /*
    private static final String APPLICATION_NAME = "Task Management System";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final Logger LOGGER = Logger.getLogger(GoogleCalendarService.class.getName());

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


    public void updateEventInStudentCalendar(
            String studentEmail,
            String taskTitle,
            String description,
            Date deadline
    ) throws Exception {
        Credential credential = getCredentials();
        Calendar service = new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                credential
        )
                .setApplicationName(APPLICATION_NAME)
                .build();

        // First, find the existing event
        Events events = service.events().list("primary")
                .setQ(taskTitle)
                .execute();

        if (events.getItems().isEmpty()) {
            // If no existing event, create a new one
            addEventToStudentCalendar(studentEmail, taskTitle, description, deadline);
            return;
        }

        // Update the first matching event
        Event eventToUpdate = events.getItems().get(0);

        // Update event details
        eventToUpdate.setSummary(taskTitle);
        eventToUpdate.setDescription(description);

        // Set new date and time
        EventDateTime eventDateTime = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(deadline))
                .setTimeZone(TimeZone.getDefault().getID());

        eventToUpdate.setStart(eventDateTime);
        eventToUpdate.setEnd(eventDateTime);

        // Set reminder
        eventToUpdate.setReminders(new Event.Reminders().setUseDefault(false)
                .setOverrides(Collections.singletonList(
                        new EventReminder().setMethod("popup").setMinutes(2880) // 2880 min = 2 days
                ))
        );

        // Update the event
        try {
            service.events().update("primary", eventToUpdate.getId(), eventToUpdate).execute();
            LOGGER.info("Successfully updated calendar event for task: " + taskTitle);
        } catch (IOException e) {
            LOGGER.severe("Failed to update calendar event: " + e.getMessage());
            throw new RuntimeException("Failed to update Google Calendar event", e);
        }
    }

     */
}

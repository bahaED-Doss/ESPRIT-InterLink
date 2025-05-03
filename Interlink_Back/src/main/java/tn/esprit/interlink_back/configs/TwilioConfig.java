/*package tn.esprit.interlink_back.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioConfig {

    @Value("${twilio.account_sid}")
    private String accountSid;

    @Value("${twilio.auth_token}")
    private String authToken;

    @Value("${twilio.phone_number}")
    private String phoneNumber;

    @Bean
    public TwilioInitializer twilioInitializer() {
        return new TwilioInitializer(accountSid, authToken);
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
}*/
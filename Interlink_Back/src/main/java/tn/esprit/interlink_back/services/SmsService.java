/*package tn.esprit.interlink_back.services;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import tn.esprit.interlink_back.configs.TwilioConfig;
@Service
public class SmsService {

    private final String accountSid;
    private final String authToken;
    private final String fromNumber;

    public SmsService(@Value("AC0d3c757de391cd7675be96dc5248894a") String accountSid,
                      @Value("d724c3cab810065629be437c36aaaebb") String authToken,
                      @Value("+21696172692") String fromNumber) {
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.fromNumber = fromNumber;
    }

    public void sendSms(String to, String message) {
        String url = String.format(
                "https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json",
                accountSid
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(accountSid, authToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("To", to);
        body.add("From", fromNumber);
        body.add("Body", message);

        new RestTemplate().postForObject(
                url,
                new HttpEntity<>(body, headers),
                String.class
        );
    }
}*/
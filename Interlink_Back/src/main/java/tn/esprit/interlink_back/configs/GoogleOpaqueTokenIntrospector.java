package tn.esprit.interlink_back.configs;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import tn.esprit.interlink_back.dtos.UserInfo;

import java.util.HashMap;
import java.util.Map;



@Component
public class GoogleOpaqueTokenIntrospector implements OpaqueTokenIntrospector {

    private final WebClient userInfoClient;

    // Explicit constructor with @Autowired
    @Autowired
    public GoogleOpaqueTokenIntrospector(WebClient userInfoClient) {
        this.userInfoClient = userInfoClient;
    }

    @Override
    public OAuth2AuthenticatedPrincipal introspect(String token) {
        try {
            UserInfo userInfo = userInfoClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/oauth2/v3/userinfo")
                            .queryParam("access_token", token)
                            .build())
                    .retrieve()
                    .bodyToMono(UserInfo.class)
                    .block();
            if (userInfo == null) {
                throw new RuntimeException("Invalid token");
            }
            Map<String, Object> attributes = new HashMap<>();
            attributes.put("sub", userInfo.sub());
            attributes.put("name", userInfo.name());
            return new OAuth2IntrospectionAuthenticatedPrincipal(userInfo.name(), attributes, null);
        } catch (Exception e) {
            throw new RuntimeException("Token introspection failed", e);
        }
    }
}
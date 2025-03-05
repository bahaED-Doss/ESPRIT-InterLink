package tn.esprit.interlink_back.controllers;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.dtos.GoogleUser;
import tn.esprit.interlink_back.dtos.TokenDto;
import tn.esprit.interlink_back.dtos.UrlDto;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")  // Allow Angular frontend
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private UserService userService;
    @Value("${spring.security.oauth2.resourceserver.opaque-token.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.resourceserver.opaque-token.client-secret}")
    private String clientSecret;
    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/auth/url")
    public ResponseEntity<UrlDto> auth() {
        String url = new GoogleAuthorizationCodeRequestUrl(clientId,
                "http://localhost:4200",
                Arrays.asList(
                        "email",
                        "profile",
                        "openid")).build();

        return ResponseEntity.ok(new UrlDto(url));
    }
    @GetMapping("/auth/github/callback")
    public ResponseEntity<?> handleGitHubCallback(@RequestParam("code") String code) {
        try {
            logger.info("Code GitHub reçu: {}", code);
            String accessToken = userService.exchangeCodeForToken(code);
            logger.info("Token d'accès GitHub obtenu: {}", accessToken);

            Map<String, Object> githubUser = userService.fetchGitHubUser(accessToken);
            logger.info("Détails de l'utilisateur GitHub: {}", githubUser);

            User user = userService.processGitHubUser(githubUser);
            String jwt = userService.generateJwtToken(user);

            return ResponseEntity.ok(Map.of(
                    "token", jwt,
                    "role", user.getRole(),
                    "id", user.getId()
            ));
        } catch (Exception e) {
            logger.error("Erreur lors de l'authentification GitHub", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de l'authentification GitHub");
        }
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/auth/callback")
    public ResponseEntity<TokenDto> callback(@RequestParam("code") String code) throws URISyntaxException {

        String token;
        try {
            token = new GoogleAuthorizationCodeTokenRequest(
                    new NetHttpTransport(), new GsonFactory(),
                    clientId,
                    clientSecret,
                    code,
                    "http://localhost:4200"
            ).execute().getAccessToken();
        } catch (IOException e) {
            System.err.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(new TokenDto(token));
    }
    @GetMapping("/auth/google/callback")
    public ResponseEntity<?> handleGoogleCallback(
            @RequestParam String code,
            @RequestParam(required = false) String state) {
        try {
            // Exchange code for token
            String accessToken = userService.exchangeCodeForToken(code);

            // Get user info from Google
            GoogleUser googleUser = userService.fetchGoogleUserDetails(accessToken);

            // Create or update user and get JWT
            User user = userService.processGoogleUser(googleUser);
            String jwt = userService.generateJwtToken(user);

            // Return response with necessary info
            return ResponseEntity.ok(Map.of(
                    "token", jwt,
                    "role", user.getRole(),
                    "id", user.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during Google authentication: " + e.getMessage());
        }
    }

    @GetMapping("auth/google/init")
    public ResponseEntity<String> initiateGoogleLogin() {
        String authUrl = String.format("https://accounts.google.com/o/oauth2/v2/auth" +
                        "?client_id=%s" +
                        "&redirect_uri=%s" +
                        "&response_type=code" +
                        "&scope=email profile" +
                        "&access_type=offline",
                "340845014781-evjvvne83oqk7ia1fdg1oclcqto82snv.apps.googleusercontent.com",
                "http://localhost:8081/api/auth/google/callback");

        return ResponseEntity.ok(authUrl);
    }
}


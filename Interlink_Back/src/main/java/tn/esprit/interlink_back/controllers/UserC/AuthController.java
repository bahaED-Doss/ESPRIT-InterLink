package tn.esprit.interlink_back.controllers.UserC;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import tn.esprit.interlink_back.dtos.GoogleUser;
import tn.esprit.interlink_back.dtos.TokenDto;
import tn.esprit.interlink_back.dtos.UrlDto;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.services.UserS.UserService;
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
            HttpServletResponse response) {
        try {
            // Step 1: Get the access token from the code
            String accessToken = exchangeCodeForToken(code);
            GoogleUser googleUser = fetchGoogleUserDetails(accessToken);

            // Step 2: Check if the user exists, if not create a new user with STUDENT role
            User user = userService.loginWithGoogle(googleUser);

            // Step 3: Generate the JWT token
            String jwtToken = userService.generateToken(user);

            // Step 4: Prepare the redirect URL to the student profile with token
            String redirectUrl = String.format(
                    "http://localhost:4200/student-profile/%s?token=%s&role=%s",
                    user.getId(),
                    jwtToken,
                    user.getRole()
            );

            // Step 5: Redirect the user to their profile
            response.sendRedirect(redirectUrl);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during Google authentication: " + e.getMessage());
        }
    }
    @GetMapping("/auth/google/init")
    public String initiateGoogleLogin() {
        // Generate the Google OAuth URL
        String clientId = "340845014781-evjvvne83oqk7ia1fdg1oclcqto82snv.apps.googleusercontent.com";
        String redirectUri = "http://localhost:8081/api/auth/google/callback";
        String googleAuthUrl = "https://accounts.google.com/o/oauth2/auth?" +
                "client_id=" + clientId + "&" +
                "redirect_uri=" + redirectUri + "&" +
                "response_type=code&" +
                "scope=email profile&" +
                "state=xyz";

        return googleAuthUrl;
    }

    private String exchangeCodeForToken(String code) throws IOException {
        // Google's token endpoint
        String tokenUrl = "https://oauth2.googleapis.com/token";

        // Prepare the request body
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("code", code);
        requestBody.add("client_id", "340845014781-evjvvne83oqk7ia1fdg1oclcqto82snv.apps.googleusercontent.com");  // Replace with your actual Google client ID
        requestBody.add("client_secret", "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");  // Replace with your actual Google client secret
        requestBody.add("redirect_uri", "http://localhost:8081/api/auth/google/callback");  // This should be the same as the one in Google Developer Console
        requestBody.add("grant_type", "authorization_code");

        // Prepare the request headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Create the HTTP entity
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        // Send the request to Google's token endpoint
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, requestEntity, Map.class);

        // Extract the access token from the response
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return (String) response.getBody().get("access_token");
        } else {
            throw new IOException("Failed to exchange code for token: " + response.getStatusCode());
        }
    }

    private GoogleUser fetchGoogleUserDetails(String accessToken) throws IOException {
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, requestEntity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> userInfo = response.getBody();
            GoogleUser googleUser = new GoogleUser();
            googleUser.setId((String) userInfo.get("sub"));
            googleUser.setEmail((String) userInfo.get("email"));
            googleUser.setFirstName((String) userInfo.get("given_name"));
            googleUser.setLastName((String) userInfo.get("family_name"));
            googleUser.setPhotoUrl((String) userInfo.get("picture"));
            return googleUser;
        } else {
            throw new IOException("Failed to fetch user details: " + response.getStatusCode());
        }
    }



}


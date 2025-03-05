package tn.esprit.interlink_back.controllers;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.interlink_back.dtos.GoogleUser;
import tn.esprit.interlink_back.entity.FaceDescriptor;
import tn.esprit.interlink_back.entity.PasswordResetToken;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.FaceRecognitionService;
import tn.esprit.interlink_back.repository.TokenRepository;
import tn.esprit.interlink_back.repository.UserRepository;
import tn.esprit.interlink_back.services.UserService;

import java.io.IOException;
import java.util.*;

@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    TokenRepository tokenRepository;
    @Autowired
    private FaceRecognitionService faceRecognitionService;

    @Autowired
    UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    // Register a new user
    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            if (!user.isEnabled()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Your account is blocked");
            }
            Map<String, Object> response = new HashMap<>();
            response.put("role", user.getRole().toString());
            response.put("id", user.getId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
    // AuthController.java (or a dedicated controller for authentication)
    @PostMapping("/login/face")
    public ResponseEntity<?> loginWithFace(@RequestBody Map<String, String> payload) {
        String imageData = payload.get("image");
        if (imageData == null || !imageData.contains(",")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid image data");
        }
        // Decode the image (assuming it is in Base64 after the data URI scheme)
        String base64Image = imageData.split(",")[1];
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        // Extract the face descriptor using the face recognition service
        FaceDescriptor descriptor = faceRecognitionService.extractDescriptor(imageBytes);

        // Find user by matching the descriptor
        Optional<User> userOpt = faceRecognitionService.findMatchingUser(descriptor);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Face not recognized"));
        }
        User user = userOpt.get();

        // Optionally, you can check if the user is enabled (not blocked)
        if (!user.isEnabled()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Your account is blocked"));
        }

        // Return the user's role and ID for frontend routing
        Map<String, Object> response = new HashMap<>();
        response.put("role", user.getRole().toString());
        response.put("id", user.getId());
        return ResponseEntity.ok(response);
    }
    @PutMapping("/user/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable Long id, @RequestBody Map<String, Boolean> blockData) {
        boolean block = blockData.get("block");
        // block == true => block user; block == false => unblock user

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // If block == true, we want user.setEnabled(false).
        // If block == false, we want user.setEnabled(true).
        user.setEnabled(!block);

        userRepository.save(user); // Save changes to DB

        String message = block
                ? "User blocked successfully"
                : "User unblocked successfully";

        // Return a JSON object => { "message": "User blocked successfully" }
        return ResponseEntity.ok(Collections.singletonMap("message", message));
    }


    @PostMapping("/user/{id}/upload-photo")
    public ResponseEntity<?> uploadPhoto(@PathVariable Long id, @RequestParam("photo") MultipartFile file) {
        try {
            String photoUrl = userService.uploadUserPhoto(id, file);
            // e.g. photoUrl = "/uploads/filename.png"
            return ResponseEntity.ok(Collections.singletonMap("photoUrl", photoUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload photo");
        }
    }
    @PostMapping("/user/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData) {
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Validate that the provided currentPassword matches the stored encrypted password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is incorrect");
        }

        // Update the password (encrypt the new password)
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/user/{id}/reset-photo")
    public ResponseEntity<?> resetPhoto(@PathVariable Long id) {
        try {
            userService.resetUserPhoto(id);
            return ResponseEntity.ok("Photo reset successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset photo");
        }
    }

    /*
    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> loginUser(@RequestBody User loginUser) {
        try {
            // Authenticate the user with email and password
            boolean success = userService.authenticateUser(loginUser.getEmail(), loginUser.getPassword());

            if (success) {
                // Check if the user is the admin by matching the email
                boolean isAdmin = "Admin@gmail.com".equals(loginUser.getEmail());

                // Create a response map
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("isAdmin", isAdmin);

                // Respond with the map
                return ResponseEntity.ok().body(response);
            } else {
                // If authentication fails, return an unauthorized response
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Invalid credentials"));
            }
        } catch (Exception e) {
            // Handle any unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "An error occurred"));
        }
    }
    */



    // Get a user by email

    @GetMapping("/userss")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }


    @GetMapping("/user")
    public ResponseEntity<User> getUser(@RequestParam String email) {
        User user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }


    public static class LoginResponse {
        private boolean success;
        private String message;

        public LoginResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
    @RequestMapping(method = RequestMethod.POST, value = "/Users")
    public void addUser(@RequestBody User user) {
        userService.addUser(user);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable Long id, @RequestBody User user) {
        userService.updateUser(id, user);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/check-email")
    public boolean checkEmailExists(@RequestParam String email) {
        return userRepository.existsByEmail(email);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
    //forget password
    @PostMapping("/forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        User user = userRepository.findByEmail(email);

        if (user != null) {
            String output = userService.sendEmail(user);
            if (output.equals("success")) {
                return ResponseEntity.ok(Collections.singletonMap("message", "Email sent successfully"));
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "User not found"));
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> requestBody) {
        String token = requestBody.get("token");
        String newPassword = requestBody.get("newPassword");

        PasswordResetToken resetToken = tokenRepository.findByToken(token);
        if (resetToken != null && !userService.hasExpired(resetToken.getExpiryDateTime())) {
            User user = resetToken.getUser();
            user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok(Collections.singletonMap("message", "Password reset successful"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "Invalid or expired token"));
    }
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleUser googleUser) {
        try {
            User user = userService.loginWithGoogle(googleUser);

            // Return the user's role and ID for frontend routing
            Map<String, Object> response = new HashMap<>();
            response.put("role", user.getRole().toString()); // Role will always be STUDENT for new users
            response.put("id", user.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during Google login");
        }
    }
    /*
    @GetMapping("/callback/google")
    public ResponseEntity<?> handleGoogleCallback(
            @RequestParam String code,
            @RequestParam(required = false) String state,
            HttpServletResponse response) {
        try {
            // Process the authentication
            String accessToken = exchangeCodeForToken(code);
            GoogleUser googleUser = fetchGoogleUserDetails(accessToken);
            User user = userService.loginWithGoogle(googleUser);

            // Generate JWT token
            String jwtToken = userService.generateToken(user);

            // Redirect to frontend with token
            String redirectUrl = String.format(
                    "http://localhost:4200/auth/callback?token=%s&role=%s&id=%s",
                    jwtToken,
                    user.getRole(),
                    user.getId()
            );

            response.sendRedirect(redirectUrl);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during Google authentication: " + e.getMessage());
        }
    }
    private String exchangeCodeForToken(String code) throws IOException {
        // Google's token endpoint
        String tokenUrl = "https://oauth2.googleapis.com/token";

        // Prepare the request body
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("code", code);
        requestBody.add("client_id", "340845014781-evjvvne83oqk7ia1fdg1oclcqto82snv.apps.googleusercontent.com");
        requestBody.add("client_secret", "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");
        requestBody.add("redirect_uri", "http://localhost:8081/api/auth/google/callback");
        requestBody.add("grant_type", "authorization_code");

        // Prepare the request headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Create the HTTP entity
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        // Send the request
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


    @GetMapping("/oauth2/authorize/google")
    public void initiateGoogleLogin(HttpServletResponse response) throws IOException {
        String clientId = "340845014781-evjvvne83oqk7ia1fdg1oclcqto82snv.apps.googleusercontent.com";
        String redirectUri = "http://localhost:8081/api/auth/google/callback";
        String state = "YOUR_STATE_PARAMETER"; // Optional but recommended

        String googleAuthUrl = "https://accounts.google.com/o/oauth2/auth?" +
                "client_id=" + clientId + "&" +
                "redirect_uri=" + redirectUri + "&" +
                "response_type=code&" +
                "scope=email profile&" +
                "state=" + state;

        // Redirect the user to Google's authorization page
        response.sendRedirect(googleAuthUrl);
    }
    */

}

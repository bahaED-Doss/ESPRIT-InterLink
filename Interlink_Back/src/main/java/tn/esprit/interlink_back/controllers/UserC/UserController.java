package tn.esprit.interlink_back.controllers.UserC;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.interlink_back.dtos.GoogleUser;
import tn.esprit.interlink_back.entity.FaceDescriptor;
import tn.esprit.interlink_back.entity.PasswordResetToken;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.FaceRecognitionService;
import tn.esprit.interlink_back.repository.TokenRepository;
import tn.esprit.interlink_back.repository.UserRepository;
import tn.esprit.interlink_back.services.UserS.UserService;

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
    @PostMapping("/auth/google/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam("code") String code) {
        try {
            // Exchange the authorization code for an access token
            String accessToken = userService.exchangeAuthCodeForAccessToken(code);
            GoogleUser googleUser = userService.fetchGoogleUserDetails(accessToken);

            // Process user details and return response
            User user = userService.processGoogleUser(googleUser);
            Map<String, Object> response = new HashMap<>();
            response.put("role", user.getRole().toString());
            response.put("id", user.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during Google login");
        }
    }

     */




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


}

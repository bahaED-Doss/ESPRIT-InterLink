package tn.esprit.interlink_back.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.interlink_back.entity.PasswordResetToken;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.TokenRepository;
import tn.esprit.interlink_back.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    // Use BCryptPasswordEncoder for hashing passwords
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TokenRepository tokenRepository;
    private static final Logger logger = (Logger) LoggerFactory.getLogger(UserService.class);
    @Autowired
    private GmailOAuth2Service gmailOAuth2Service;


    // Register a new user
    public User registerUser(User user) {
        // Validate email uniqueness
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Encode the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Validate role-specific fields
        validateRoleSpecificFields(user);

        // Save the user to the database
        return userRepository.save(user);
    }

    // Validate role-specific fields
    private void validateRoleSpecificFields(User user) {
        switch (user.getRole()) {
            case STUDENT:
                if (user.getLevelOfStudy() == null || user.getEmail() == null || user.getPhoneNumber() == null) {
                    throw new RuntimeException("Missing required fields for Student");
                }
                break;
            case HR:
                if (user.getCompanyName() == null || user.getCompanyIdentifier() == null || user.getEmail() == null) {
                    throw new RuntimeException("Missing required fields for HR");
                }
                break;
            case PROJECT_MANAGER:
                if (user.getDepartment() == null || user.getYearsOfExperience() == 0 || user.getEmail() == null) {
                    throw new RuntimeException("Missing required fields for Project Manager");
                }
                break;
            case ADMIN:
                if (user.getEmail() == null) {
                    throw new RuntimeException("Missing required fields for ADMIN");
                }
                break;
            default:
                throw new RuntimeException("Invalid role");
        }
    }

    // Find a user by email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<User> getUser() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }

    public void addUser(User user) {
        if (user == null) {
            logger.info("User object is null");
            throw new IllegalArgumentException("User cannot be null");
        }

        // Hash the password before saving the user
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        logger.info("Adding user: {}");
        userRepository.save(user);
    }


    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(updatedUser.getRole());

        // Only update the password if a new one is provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            String encryptedPassword = passwordEncoder.encode(updatedUser.getPassword());
            existingUser.setPassword(encryptedPassword);
        }

        return userRepository.save(existingUser);
    }

    public void deleteUser(int id) {
        userRepository.deleteById((long) id);
    }

    public User getUserById(int id) {
        Optional<User> optionalUser = userRepository.findById((long) id);
        return optionalUser.orElse(null);
    }

    /* Updated authenticate method to use password encoding
    public boolean authenticateUser(String email, String password) {
        // Fetch the user from the database by email
        User user = userRepository.findByEmail(email);

        // Check if the user exists and if the password matches using BCrypt
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return true; // Authentication successful
        }

        return false; // Authentication failed
    }
    */
    public String sendEmail(User user) {
        try {
            // Check if the user exists
            User existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser == null) {
                return "User not found";
            }

            // Generate the reset token
            String resetLink = generateResetToken(existingUser);

            // Prepare the HTML email content
            String subject = "Password Reset Request";
            String htmlBody = generateHtmlEmail(resetLink);

            // Send the email using GmailOAuth2Service
            gmailOAuth2Service.sendEmail(existingUser.getEmail(), subject, htmlBody);

            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }
    private String generateHtmlEmail(String resetLink) {
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Password Reset</title>\n" +
                "    <style>\n" +
                "        body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333; }\n" +
                "        .email-container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; " +
                "box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden; }\n" +
                "        .header { background: linear-gradient(135deg, #d32f2f, #a70000); color: #ffffff; text-align: center; padding: 20px; " +
                "font-size: 24px; font-weight: bold; }\n" +
                "        .content { padding: 30px; font-size: 16px; line-height: 1.6; color: #555; }\n" +
                "        .content p { margin-bottom: 20px; }\n" +
                "        .button { display: block; width: fit-content; background: #d32f2f; color: #ffffff; text-decoration: none; font-size: 18px; " +
                "font-weight: bold; padding: 12px 24px; border-radius: 5px; text-align: center; margin: 20px auto; transition: 0.3s ease-in-out; }\n" +
                "        .button:hover { background: #a70000; }\n" +
                "        .footer { text-align: center; font-size: 14px; color: #888; padding: 15px; background: #f4f4f4; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "<div class=\"email-container\">\n" +
                "    <div class=\"header\">Password Reset</div>\n" +
                "    <div class=\"content\">\n" +
                "        <p>Hello,</p>\n" +
                "        <p>You have requested to reset your password. Please click the button below to reset it:</p>\n" +
                "        <a href=\"" + resetLink + "\" class=\"button\">Reset Password</a>\n" +
                "        <p>If you did not request a password reset, please ignore this email.</p>\n" +
                "    </div>\n" +
                "    <div class=\"footer\">&copy; 2025 Esprit_Interlink. All rights reserved.</div>\n" +
                "</div>\n" +
                "</body>\n" +
                "</html>";
    }

/*
    public String sendEmail(User user) {
        try {
            // Check if the user exists in the database
            User existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser == null) {
                return "User not found";
            }

            String resetLink = generateResetToken(existingUser); // Use the existing user

            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(existingUser.getEmail());
            msg.setSubject("Reset Password");
            msg.setText("Click the following link to reset your password: " + resetLink);

            javaMailSender.send(msg);

            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }
*/

    public String generateResetToken(User user) {
        UUID uuid = UUID.randomUUID();
        LocalDateTime expiryDateTime = LocalDateTime.now().plusMinutes(30);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(uuid.toString());
        resetToken.setExpiryDateTime(expiryDateTime);

        tokenRepository.save(resetToken);

        String endpointUrl = "http://localhost:4200/reset-password";
        return endpointUrl + "/" + resetToken.getToken();
    }

    public boolean hasExpired(LocalDateTime expiryDateTime) {
        return expiryDateTime.isBefore(LocalDateTime.now());
    }

    // Full reset password function with password hashing
    public String resetPassword(String token, String newPassword) {
        // Find the token in the repository
        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null) {
            return "Invalid token";
        }

        // Check if the token has expired
        if (hasExpired(resetToken.getExpiryDateTime())) {
            return "Token has expired";
        }

        // Get the user associated with the token
        User user = resetToken.getUser();

        if (user == null) {
            return "Invalid token: User not found";
        }

        // Hash the new password before saving it
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Optionally, delete the token after resetting the password
        tokenRepository.delete(resetToken);

        return "Password has been reset successfully";
    }
    /*
    public void processOAuthPostLogin(String username) {
        User existUser = userRepository.getUserByUsername(username);

        if (existUser == null) {
            User newUser = new User();
            newUser.setFirstName(username);
            newUser.setProvider(Provider.FACEBOOK);
            newUser.setEnabled(true);

            userRepository.save(newUser);
        }

    }
    */


}

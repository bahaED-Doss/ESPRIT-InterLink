package tn.esprit.interlink_back.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.interlink_back.dtos.GoogleUser;
import tn.esprit.interlink_back.entity.PasswordResetToken;
import tn.esprit.interlink_back.entity.Provider;
import tn.esprit.interlink_back.entity.Enums.Role;
import tn.esprit.interlink_back.entity.User;
import tn.esprit.interlink_back.repository.TokenRepository;
import tn.esprit.interlink_back.repository.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;


@Service
public class UserService {
    private final String JWT_SECRET = "befda9f0bd9cd5b3cf1014cb9df5262ce22e18e7709"; // Use a secure secret in production
    private final String GOOGLE_CLIENT_ID = "340845014781-evjvvne83oqk7ia1fdg1oclcqto82snv.apps.googleusercontent.com";
    private final String GOOGLE_CLIENT_SECRET = "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";

    private static final String GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
    private static final String GITHUB_USER_URL = "https://api.github.com/user";


    @Value("${github.client-id}")
    private String clientId;

    @Value("${github.client-secret}")
    private String clientSecret;

    @Value("${github.redirect-uri}")
    private String redirectUri;
    private final RestTemplate restTemplate = new RestTemplate();
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileStorageService fileStorageService;
    // Use BCryptPasswordEncoder for hashing passwords
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TokenRepository tokenRepository;
    private static final Logger logger = (Logger) LoggerFactory.getLogger(UserService.class);
    @Autowired
    private GmailOAuth2Service gmailOAuth2Service;
    private final String jwtSecret = "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"; // Replace with a secure secret key
    private final long jwtExpirationMs = 86400000; // 24 hours

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;

    }
    public User saveUser(User user) {
        return userRepository.save(user);
    }
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
    public User blockUser(Long id, boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setEnabled(enabled);
        return userRepository.save(user);
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

        // Update common fields
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());

        // Update levelOfStudy only if the user is a STUDENT.
        if (existingUser.getRole() == Role.STUDENT) {
            existingUser.setLevelOfStudy(updatedUser.getLevelOfStudy());
        }

        // Update social links (applies to all roles)
        existingUser.setFacebook(updatedUser.getFacebook());
        existingUser.setGithubLink(updatedUser.getGithubLink());
        existingUser.setLinkedin(updatedUser.getLinkedin());
        existingUser.setInstagram(updatedUser.getInstagram());

        // Update password if a new one is provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            String encryptedPassword = passwordEncoder.encode(updatedUser.getPassword());
            existingUser.setPassword(encryptedPassword);
        }

        // Update role only if a new role is provided (otherwise, keep the existing role)
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }

        return userRepository.save(existingUser);
    }


    public User loginWithGoogle(GoogleUser googleUser) {
        // Check if the user already exists by email
        User existingUser = userRepository.findByEmail(googleUser.getEmail());

        if (existingUser != null) {
            // If the user exists, update their Google ID and provider
            existingUser.setGoogleId(googleUser.getId());
            existingUser.setProvider(Provider.valueOf("GOOGLE"));
            return userRepository.save(existingUser);
        } else {
            // Create a new user with the role set to STUDENT
            User newUser = new User();
            newUser.setGoogleId(googleUser.getId());
            newUser.setEmail(googleUser.getEmail());
            newUser.setFirstName(googleUser.getFirstName());
            newUser.setLastName(googleUser.getLastName());
            newUser.setPhotoUrl(googleUser.getPhotoUrl());
            newUser.setRole(Role.STUDENT); // Explicitly set role to STUDENT
            newUser.setProvider(Provider.valueOf("GOOGLE"));

            return userRepository.save(newUser);
        }
    }
    // Upload photo and update the user photo URL
    public String uploadUserPhoto(Long userId, MultipartFile file) throws IOException {
        String photoUrl = fileStorageService.storeFile(file); // Save the file to storage and get the URL
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPhotoUrl(photoUrl);
        userRepository.save(user);
        return photoUrl;
    }

    // Reset photo to default
    public void resetUserPhoto(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPhotoUrl("https://bootdey.com/img/Content/avatar/avatar1.png"); // Default image URL
        userRepository.save(user);
    }

    public void deleteUser(int id) {
        userRepository.deleteById((long) id);
    }

    public User getUserById(int id) {
        Optional<User> optionalUser = userRepository.findById((long) id);
        return optionalUser.orElse(null);
    }
    public String exchangeCodeForToken(String code) throws IOException {
        String url = "https://github.com/login/oauth/access_token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("code", code);
        body.add("redirect_uri", redirectUri);  // Vérifier si ce paramètre est correct

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getBody() != null && response.getBody().containsKey("access_token")) {
            return response.getBody().get("access_token").toString();
        }

        throw new RuntimeException("Erreur lors de l'échange du code GitHub pour un token");
    }
    // Récupère les informations de l'utilisateur depuis GitHub
    public Map<String, Object> fetchGitHubUser(String accessToken) {
        String url = "https://api.github.com/user";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        return response.getBody();
    }
    // Traite l'utilisateur GitHub (crée ou met à jour)
    public User processGitHubUser(Map<String, Object> githubUser) {
        String githubId = String.valueOf(githubUser.get("id"));
        String firstName = (String) githubUser.get("name");
        String email = (String) githubUser.get("email");
        String photoUrl = (String) githubUser.get("avatar_url");

        // Si l'email est privé ou non disponible, utilisez une adresse générique
        if (email == null) {
            email = "github-user-" + githubId + "@github.com"; // Email généré automatiquement
            logger.warn("Email GitHub non public, utilisation d'un email générique: {}", email);
        }

        Optional<User> existingUser = Optional.ofNullable(userRepository.findByEmail(email));

        String finalEmail = email;
        return existingUser.orElseGet(() -> {
            User newUser = new User(githubId, firstName, "", finalEmail, photoUrl, Role.STUDENT);
            return userRepository.save(newUser);
        });
    }

    // Génère un JWT pour l'utilisateur
    public String generateJwtToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs)) // Set expiration time
                .claim("role", user.getRole().toString()) // Add role claim
                .claim("id", user.getId()) // Add user ID claim
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
    public GoogleUser fetchGoogleUserDetails(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        String url = "https://www.googleapis.com/oauth2/v3/userinfo";
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        Map<String, Object> userInfo = response.getBody();

        GoogleUser googleUser = new GoogleUser();
        googleUser.setEmail((String) userInfo.get("email"));
        googleUser.setFirstName((String) userInfo.get("name"));
        googleUser.setPhotoUrl((String) userInfo.get("picture"));
        return googleUser;
    }

    public User processGoogleUser(GoogleUser googleUser) {
        User user = userRepository.findByEmail(googleUser.getEmail());
        if (user == null) {
            user = new User();
            user.setRole(Role.STUDENT); // Set role as STUDENT for new users
        }

        // Update or create the user with Google details
        user.setEmail(googleUser.getEmail());
        user.setFirstName(googleUser.getFirstName());
        user.setLastName(googleUser.getLastName());
        user.setPhotoUrl(googleUser.getPhotoUrl());
        user.setProvider(Provider.GOOGLE);
        user.setEnabled(true);

        return userRepository.save(user);
    }


    //github
    public User processOAuthUser(OAuth2User principal) {
        String email = principal.getAttribute("email");
        if (email == null) {
            throw new RuntimeException("GitHub account does not have a public email.");
        }

        Optional<User> existingUser = Optional.ofNullable(userRepository.findByEmail(email));
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // Create a new Student user
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFirstName(principal.getAttribute("name"));
        newUser.setPhotoUrl(principal.getAttribute("avatar_url"));
        newUser.setRole(Role.STUDENT);
        return userRepository.save(newUser);
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
                "        .header img { display: block; margin: 0 auto; width: 180px; height: auto; margin-bottom: 10px; }\n" +
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
                "    <div class=\"header\">\n" +
                "        <img src=\"https://i.imgur.com/qI4IRFM.png\" alt=\"Company Logo\" >\n" + // Remplace l'URL par le lien réel de ton image
                "        Password Reset\n" +
                "    </div>\n" +
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

    public String exchangeAuthCodeForAccessToken(String code) {
        String tokenUri = "https://oauth2.googleapis.com/token";
        HttpHeaders headers = new HttpHeaders();
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", "340845014781-evjvvne83oqk7ia1fdg1oclcqto82snv.apps.googleusercontent.com");
        body.add("client_secret", "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");
        body.add("redirect_uri", "http://localhost:8081/api/auth/google/callback"); // Ensure this matches the frontend redirect URI
        body.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(tokenUri, HttpMethod.POST, request, Map.class);

        String accessToken = (String) response.getBody().get("access_token");
        return accessToken;
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
    public void processOAuthPostLogin(String email) {
        User existUser = userRepository.findByEmail(email);

        if (existUser == null) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setProvider(Provider.GOOGLE);
            newUser.setEnabled(true);
            // Set other necessary user properties

            userRepository.save(newUser);
        }
    }
        public String generateToken(User oauthUser) {
            return Jwts.builder()
                    .setSubject(oauthUser.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                    .claim("name", oauthUser.getFirstName() )
                    .claim("email", oauthUser.getEmail())
                    // Add any additional claims you need
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact();
        }
    }




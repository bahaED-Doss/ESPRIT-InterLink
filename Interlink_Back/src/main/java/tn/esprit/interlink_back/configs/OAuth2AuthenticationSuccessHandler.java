package tn.esprit.interlink_back.configs;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // Get authenticated user
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        // Extract student ID from user attributes (adjust according to your user structure)
        String studentId = oauth2User.getAttribute("id").toString();  // Ensure your OAuth2User contains an 'id'

        // Redirect to Angular frontend with the student ID
        response.sendRedirect("http://localhost:4200/student-profile/" + studentId);
    }
}
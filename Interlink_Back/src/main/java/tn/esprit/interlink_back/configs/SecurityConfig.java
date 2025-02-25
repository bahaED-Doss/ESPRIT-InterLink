package tn.esprit.interlink_back.configs;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import tn.esprit.interlink_back.entity.CustomOAuth2User;
import tn.esprit.interlink_back.service.CustomOAuth2UserService;
import tn.esprit.interlink_back.service.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService oauth2UserService;

    @Autowired
    public SecurityConfig(CustomOAuth2UserService oauth2UserService) {
        this.oauth2UserService = oauth2UserService;
    }
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source); // FIX: Pass the source to the CorsFilter constructor
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Enable CORS
                .cors(Customizer.withDefaults())  //
                // Disable CSRF protection
                .csrf(csrf -> csrf.disable())

                // Configure session management as stateless
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Configure URL authorization
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll()
                )

                // Configure form login and OAuth2 login
                .formLogin(form -> form
                        .loginPage("/login")
                        .permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login")
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oauth2UserService)
                        )
                        .successHandler(oauth2AuthenticationSuccessHandler())
                );

        return http.build();
    }

    @Bean
    public OpaqueTokenIntrospector introspector(GoogleOpaqueTokenIntrospector introspector) {
        return introspector;
    }

    @Bean
    public AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler() {
        return (HttpServletRequest request, HttpServletResponse response, Authentication authentication) -> {
            // Cast authentication principal to CustomOAuth2User
            CustomOAuth2User oauthUser = (CustomOAuth2User) authentication.getPrincipal();

            // Process post-login actions
            //userService.processOAuthPostLogin(oauthUser.getEmail());

            // Redirect to the specified page
            response.sendRedirect("/login");
        };
    }


    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }
}
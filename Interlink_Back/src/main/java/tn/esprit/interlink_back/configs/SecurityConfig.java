
package tn.esprit.interlink_back.configs;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.function.client.WebClient;
import tn.esprit.interlink_back.entity.CustomOAuth2User;
import tn.esprit.interlink_back.repository.UserRepository;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository.CustomOAuth2UserService oauth2UserService;

    @Autowired
    public SecurityConfig(UserRepository.CustomOAuth2UserService oauth2UserService) {
        this.oauth2UserService = oauth2UserService;
    }
    @Bean
    public CorsFilter corsFilter() {

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200")); // Allow Angular frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
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
                        .requestMatchers(
                                "/",
                                "/error",
                                "/login",
                                "/oauth2/**",
                                "/api/**",
                                "/oauth2/callback/**",
                                "/uploads/**"
                        ).permitAll()
                        .anyRequest().authenticated()

                )

                // Configure form login and OAuth2 login
                .formLogin(form -> form
                        .loginPage("/login")
                        .permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        //.loginPage("/login")
                        .defaultSuccessUrl("http://localhost:4200/student-profile/{id}", true)
                        .successHandler(oauth2AuthenticationSuccessHandler())

                        .failureUrl("/login?error=true")
                        .authorizationEndpoint(authorization -> authorization
                                .baseUri("/oauth2/authorize"))
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/oauth2/callback/*"))
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

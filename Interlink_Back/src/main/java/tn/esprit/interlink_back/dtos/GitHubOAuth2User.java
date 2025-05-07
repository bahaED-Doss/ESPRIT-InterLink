package tn.esprit.interlink_back.dtos;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class GitHubOAuth2User implements OAuth2User {
    private final Map<String, Object> attributes;

    public GitHubOAuth2User(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getName() {
        return attributes.get("login").toString();
    }

    public String getEmail() {
        return attributes.get("email") != null ? attributes.get("email").toString() : null;
    }

    public String getAvatarUrl() {
        return attributes.get("avatar_url").toString();
    }
}
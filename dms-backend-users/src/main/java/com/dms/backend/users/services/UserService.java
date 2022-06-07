package com.dms.backend.users.services;

import com.dms.backend.users.model.entities.User;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    public static final String ROLES_URL = "https://localhost:8443/admin/realms/dms/roles/";
    public static final String USERS_URL = "https://localhost:8443/admin/realms/dms/users/";
    public static final String CLIENT_USERS = "application-client/users";
    public static final String SYSTEM_ADMIN_USERS = "application-system-admin/users";
    public static final String DOCUMENT_ADMIN_USERS = "application-document-admin/users";
    KeycloakRestTemplate keycloakRestTemplate;

    UserService(KeycloakRestTemplate keycloakRestTemplate) {
        this.keycloakRestTemplate = keycloakRestTemplate;
    }

    public User[] getUsers(String role){
        String roleUrl = switch (role) {
            case "system-admin" -> SYSTEM_ADMIN_USERS;
            case "document-admin" -> DOCUMENT_ADMIN_USERS;
            default -> CLIENT_USERS;
        };
        return keycloakRestTemplate.getForEntity(ROLES_URL + roleUrl, User[].class).getBody();
    }

    public boolean deleteUser(String id) {
        keycloakRestTemplate.delete(USERS_URL+id);
        return true;
    }

    //TODO napraviti novu klasu za dodavanje usera
    //TODO dodati akcije za korisnike
    public void addUser(User user) {
//        keycloakRestTemplate.postForEntity(USERS_URL, user);
    }
}

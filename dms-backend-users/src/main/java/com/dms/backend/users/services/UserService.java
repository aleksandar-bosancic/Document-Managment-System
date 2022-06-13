package com.dms.backend.users.services;

import com.dms.backend.users.model.*;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;

@Service
public class UserService {
    public static final String USER_BY_USERNAME = "https://localhost:8443/admin/realms/dms/users?username=";
    public static final String EXACT = "&exact=true";
    public static final String USERS_URL = "https://localhost:8443/admin/realms/dms/users/";
    public static final String GROUPS_URL = "https://localhost:8443/admin/realms/dms/groups/";
    public static final String CLIENT_USERS = "application-client";
    public static final String SYSTEM_ADMIN_USERS = "application-system-admin";
    public static final String DOCUMENT_ADMIN_USERS = "application-document-admin";
    public KeycloakRestTemplate keycloakRestTemplate;

    UserService(KeycloakRestTemplate keycloakRestTemplate) {
        this.keycloakRestTemplate = keycloakRestTemplate;
    }

    public User[] getUsers(String role) {
        String roleUrl = switch (role) {
            case "system-admin" -> SYSTEM_ADMIN_USERS;
            case "document-admin" -> DOCUMENT_ADMIN_USERS;
            default -> CLIENT_USERS;
        };
        UserGroup[] groups = keycloakRestTemplate.getForEntity(GROUPS_URL, UserGroup[].class).getBody();
        String groupId = Arrays.stream(groups).filter(userGroup -> userGroup.getName().equals(roleUrl)).findAny().get().getId();
        return keycloakRestTemplate.getForEntity(GROUPS_URL + groupId + "/members", User[].class).getBody();
    }

    public void deleteUser(String id) {
        try {
            keycloakRestTemplate.delete(USERS_URL + id);
        } catch (Exception ignored) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    public User addUser(AddUser user) {
        AddUserRequest request = new AddUserRequest();
        request.setUsername(user.getUsername());
        request.setEmail(user.getEmail());
        request.setFirstName(user.getFirstName());
        request.setLastName(user.getLastName());
        request.setAttributes(user.getAttributes());
        request.setGroups(user.getRealmRoles());
        Credentials credentials = new Credentials();
        credentials.setValue(user.getUsername());
        Credentials[] cred = {credentials};
        request.setCredentials(cred);
        try {
            keycloakRestTemplate.postForEntity(USERS_URL, request, User.class);
            User[] created = keycloakRestTemplate.getForEntity(USER_BY_USERNAME + user.getUsername() + EXACT, User[].class).getBody();
            assert created != null;
            return created[0];

        } catch (Exception ignored) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    public void updateUser(User user) {
        try {
            keycloakRestTemplate.put(USERS_URL + user.getId(), user);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    public void resetPassword(User user) {
        System.out.println(user.getId());
        Credentials credentials = new Credentials();
        credentials.setValue(user.getUsername());
        keycloakRestTemplate.put(USERS_URL + user.getId() + "/reset-password", credentials);
    }
}

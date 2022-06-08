package com.dms.backend.users.model.entities;

import lombok.Data;

@Data
public class AddUserRequest {
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private boolean emailVerified = true;
    private boolean enabled = true;
    private String[] groups;
    private Attribute attributes;
    private Credentials[] credentials;
}

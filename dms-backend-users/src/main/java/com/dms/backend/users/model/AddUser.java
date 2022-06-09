package com.dms.backend.users.model;

import lombok.Data;

import java.util.Arrays;

@Data
public class AddUser {
    String username;
    String firstName;
    String lastName;
    String email;
    String[] realmRoles;
    Attribute attributes;

    @Override
    public String toString() {
        return "AddUser{" +
                "username='" + username + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", realmRoles=" + Arrays.toString(realmRoles) +
                ", attributes=" + attributes +
                '}';
    }
}

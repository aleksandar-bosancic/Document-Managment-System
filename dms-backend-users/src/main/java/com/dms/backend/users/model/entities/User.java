package com.dms.backend.users.model.entities;

import lombok.Data;

@Data
public class User {
    String id;
    String username;
    String firstName;
    String lastName;
    String email;
    Attribute attributes;

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", attributes=" + attributes +
                '}';
    }
}

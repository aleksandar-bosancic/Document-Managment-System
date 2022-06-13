package com.dms.backend.documents.model;

import lombok.Data;

@Data
public class User {
    String id;
    String username;
    String firstName;
    String lastName;
    String email;
    Attribute attributes;
}

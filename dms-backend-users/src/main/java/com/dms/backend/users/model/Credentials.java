package com.dms.backend.users.model;

import lombok.Data;

@Data
public class Credentials {
    private String type = "password";
    private String value;
    private boolean temporary = true;
}

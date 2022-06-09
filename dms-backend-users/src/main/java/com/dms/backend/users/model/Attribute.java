package com.dms.backend.users.model;

import lombok.Data;

@Data
public class Attribute {
    String[] rootDirectory;
    String[] allowedDomains;
    String[] actions;
}

package com.dms.backend.users.model.entities;

import lombok.Data;

@Data
public class Attribute {
    String[] rootDirectory;
    String[] allowedDomains;
}

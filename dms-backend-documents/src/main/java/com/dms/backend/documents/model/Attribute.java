package com.dms.backend.documents.model;

import lombok.Data;

@Data
public class Attribute {
    String[] rootDirectory;
    String[] allowedDomains;
    String[] actions;
}

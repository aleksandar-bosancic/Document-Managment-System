package com.dms.backend.documents.model;

import lombok.Data;

@Data
public class RenameRequest {
    String file;
    String name;
}

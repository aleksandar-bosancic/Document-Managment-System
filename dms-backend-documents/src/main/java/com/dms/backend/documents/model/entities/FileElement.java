package com.dms.backend.documents.model.entities;

import lombok.Data;

@Data
public class FileElement {
    private String id;
    private boolean isFolder;
    private String name;
    private String parent;
    private byte[] file;
}

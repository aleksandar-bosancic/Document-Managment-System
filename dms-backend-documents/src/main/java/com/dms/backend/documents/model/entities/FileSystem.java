package com.dms.backend.documents.model.entities;

import java.io.Serializable;
import java.util.UUID;

public class FileSystem implements Serializable {
    private FileElement root;

    public FileSystem(){
        String uuid = UUID.randomUUID().toString();
        root = new FileElement();
        root.setName("root");
        root.setFolder(true);
        root.setId(uuid);
    }
}

package com.dms.backend.documents.model;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;

@Data
public class FileSystem implements Serializable {
    private FileElement root;

    public FileSystem(){
        root = new FileElement();
        root.setName("root");
        root.setFolder(true);
        root.setChildren(new ArrayList<>());
    }
}

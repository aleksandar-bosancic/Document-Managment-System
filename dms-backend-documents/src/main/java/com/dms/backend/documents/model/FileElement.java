package com.dms.backend.documents.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;

@Data
public class FileElement {
    private String name;
    private boolean isFolder;
    private String path;
    private List<FileElement> children;
    @JsonIgnore
    private byte[] file;

    @Override
    public String toString() {
        return "FileElement{" +
                "name='" + name + '\'' +
                ", isFolder=" + isFolder +
                ", path='" + path + '\'' +
                ", children=" + children +
                '}';
    }
}

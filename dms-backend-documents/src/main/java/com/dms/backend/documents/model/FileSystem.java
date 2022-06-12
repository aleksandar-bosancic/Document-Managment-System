package com.dms.backend.documents.model;

import lombok.Data;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    public void serialize(){
        Path root = Paths.get("D:\\Projekti\\Document Managment System\\dms-backend-documents\\serialized.bin");
        try(ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(root.toFile()))) {
            oos.writeObject(this);
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
    }

    public static FileSystem deserialize(){
        Path root = Paths.get("D:\\Projekti\\Document Managment System\\dms-backend-documents\\serialized.bin");
        FileSystem fileSystem;
        try(ObjectInputStream ois = new ObjectInputStream(new FileInputStream(root.toFile()))){
            fileSystem = (FileSystem) ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            fileSystem = null;
        }
        return fileSystem;
    }
}

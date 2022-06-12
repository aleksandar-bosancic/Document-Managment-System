package com.dms.backend.documents.services;

import com.dms.backend.documents.model.*;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;

@Service
public class FileService {
    public FileSystem fileSystem;

    public FileElement getFiles(String rootDir) {
        FileElement root = fileSystem.getRoot().getChildren().stream()
                .filter(fileElement -> fileElement.getName().equals(rootDir)).findAny().orElse(null);
        if (root == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return root;
    }

    public FileElement getRootDirectory(){
        return fileSystem.getRoot();
    }

    public void addUserRootDirectory(String name){
        FileElement userRoot = new FileElement();
        userRoot.setName(name);
        userRoot.setFolder(true);
        userRoot.setPath(name);
        userRoot.setChildren(new ArrayList<>());
        fileSystem.getRoot().getChildren().add(userRoot);
    }

    public void addFolder(FileElement file) {
        FileElement temp = findFile(file, "", true);
        if (temp == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        if (temp.getChildren() == null) {
            temp.setChildren(new ArrayList<>());
        }
        temp.getChildren().add(file);
    }

    public void removeFile(DeleteRequest request) {
        FileElement temp = findFile(null, request.getPath(), true);
        String[] elements = request.getPath().split("/");
        String fileName = elements[elements.length-1];
        if (temp == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        if (temp.getChildren() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        FileElement toDelete = temp.getChildren().stream().filter(fileElement -> fileElement.getName().equals(fileName)).findAny().orElse(null);
        if (toDelete == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        temp.getChildren().remove(toDelete);
    }

    public FileElement findFile(FileElement file, String path, boolean parent) {
        String[] elements;
        if (file != null) {
            elements = file.getPath().split("/");
        } else {
            elements = path.split("/");
        }
        int counter = 0;
        FileElement currentElement = fileSystem.getRoot();
        for (String s : elements) {
            counter++;
            if (currentElement.getChildren() == null && counter < elements.length) {
                return null;
            }
            FileElement temp = currentElement.getChildren().stream()
                    .filter(fileName -> fileName.getName().equals(s)).findAny().orElse(null);
            if (temp == null && counter < elements.length) {
                return null;
            } else {
                currentElement = temp;
            }
            if (parent && counter == (elements.length - 1)) {
                break;
            }
        }
        return currentElement;
    }

    public void renameFile(RenameRequest request) {
        FileElement file = findFile(null, request.getFile(), false);
        if (file == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        String oldName = file.getName();
        StringBuilder stringBuilder = new StringBuilder(file.getPath());
        stringBuilder.replace(file.getPath().length() - oldName.length(), file.getPath().length(), request.getName());
        file.setName(request.getName());
        file.setPath(stringBuilder.toString());
    }

    public void moveFile(MoveRequest request) {
        FileElement parent = findFile(null, request.getFilePath(), true);
        FileElement file = findFile(null, request.getFilePath(), false);
        FileElement destination = findFile(null, request.getMoveToPath(), false);
        if (parent == null || file == null || destination == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        if (destination.getChildren() == null){
            destination.setChildren(new ArrayList<>());
        }
        file.setPath(destination.getPath() + "/" + file.getName());
        destination.getChildren().add(file);
        parent.getChildren().remove(file);
    }

    public void addFile(MultipartFile file, String realPath) throws IOException {
        FileElement parent = findFile(null, realPath, true);
        if (parent == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        FileElement fileElement = new FileElement();
        fileElement.setName(file.getOriginalFilename());
        fileElement.setPath(realPath);
        fileElement.setFolder(false);
        fileElement.setFile(file.getBytes());
        if (parent.getChildren() == null){
            parent.setChildren(new ArrayList<>());
        }
        parent.getChildren().add(fileElement);
    }

    public void replaceFile(MultipartFile file, String realPath) throws IOException {
        FileElement fileElement = findFile(null, realPath, false);
        fileElement.setFile(file.getBytes());
    }

    @Scheduled(cron = "*/10 * * * * *")
    public void serializeFileSystem(){
        fileSystem.serialize();
    }
}

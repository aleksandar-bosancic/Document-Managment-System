package com.dms.backend.documents.controllers;

import com.dms.backend.documents.model.*;
import com.dms.backend.documents.services.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/client")
public class FilesController {
    private FileService fileService;


    FilesController(FileService fileService) {
        this.fileService = fileService;
        fileService.fileSystem = new FileSystem();
        FileElement clientDir = new FileElement();
        clientDir.setName("clientDir");
        clientDir.setFolder(true);
        clientDir.setPath("clientDir");
        FileElement nekidir = new FileElement();
        nekidir.setName("neki");
        nekidir.setFolder(true);
        nekidir.setPath("clientDir/neki");
        FileElement nekidirdr = new FileElement();
        nekidirdr.setName("nekidr");
        nekidirdr.setFolder(true);
        nekidirdr.setPath("clientDir/neki/nekidr");
        nekidir.setChildren(new ArrayList<>(List.of(nekidirdr)));
        clientDir.setChildren(new ArrayList<>(List.of(nekidir)));
        fileService.fileSystem.getRoot().getChildren().add(clientDir);
    }

    @GetMapping("/directory/root/{name}")
    public ResponseEntity<FileElement> getClientFiles(@PathVariable String name) {
        FileElement response = fileService.getFiles(name);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/directory/add")
    public ResponseEntity<HttpStatus> addFile(@RequestBody FileElement fileElement){
        fileService.addFolder(fileElement);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/directory/remove")
    public ResponseEntity<HttpStatus> removeFile(@RequestBody DeleteRequest request){
        fileService.removeFile(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/directory/update")
    public ResponseEntity<HttpStatus> renameFile(@RequestBody RenameRequest request){
        fileService.renameFile(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/directory/move")
    public ResponseEntity<HttpStatus> moveFile(@RequestBody MoveRequest request){
        fileService.moveFile(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/file/upload")
    public ResponseEntity<HttpStatus> uploadFile(@RequestParam MultipartFile file, @RequestParam String path){
        String realPath = path.replaceAll("#", "/");
        try {
            fileService.addFile(file, realPath);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

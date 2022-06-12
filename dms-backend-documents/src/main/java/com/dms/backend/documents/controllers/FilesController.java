package com.dms.backend.documents.controllers;

import com.dms.backend.documents.model.*;
import com.dms.backend.documents.services.FileService;
import com.dms.backend.documents.services.UtilService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/client")
public class FilesController {
    private final FileService fileService;


    FilesController(FileService fileService) {
        this.fileService = fileService;
        this.fileService.fileSystem = FileSystem.deserialize();
        if (fileService.fileSystem == null){
            this.fileService.fileSystem = new FileSystem();
        }
        this.fileService.serializeFileSystem();
    }

    @GetMapping("/admin/directory/root")
    public ResponseEntity<FileElement> getRootFile(){
        FileElement response = fileService.getRootDirectory();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/admin/directory/add-user-root/{name}")
    public ResponseEntity<HttpStatus> addUserRootDirectory(@PathVariable String name){
        this.fileService.addUserRootDirectory(name);
        return new ResponseEntity<>(HttpStatus.OK);
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

    @PostMapping("/file/replace")
    public ResponseEntity<HttpStatus> replaceFile(@RequestParam MultipartFile file, @RequestParam String path){
        String realPath = path.replaceAll("#", "/");
        try {
            fileService.replaceFile(file, realPath);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/file/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam String path) {
        FileElement file = fileService.findFile(null, path.replaceAll("#", "/"), false);
        Resource resource = new ByteArrayResource(file.getFile());
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_TYPE, "text/plain");
        headers.set(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(file.getName()).build().toString());
        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }

}

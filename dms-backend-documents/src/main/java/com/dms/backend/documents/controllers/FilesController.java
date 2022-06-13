package com.dms.backend.documents.controllers;

import com.dms.backend.documents.model.*;
import com.dms.backend.documents.services.ClientAccessService;
import com.dms.backend.documents.services.FileService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping
public class FilesController {
    private final FileService fileService;
    private final ClientAccessService clientAccessService;

    FilesController(FileService fileService, ClientAccessService clientAccessService) {
        this.clientAccessService = clientAccessService;
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

    @GetMapping("/client/directory/root/{name}")
    public ResponseEntity<FileElement> getClientFiles(@PathVariable String name, HttpServletRequest request) {
        boolean status = clientAccessService.userAccessCheck(request.getRemoteUser(), request.getRemoteAddr());
        if (!status){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Domain not allowed.");
        }
        FileElement responseFile = fileService.getFiles(name);
        return new ResponseEntity<>(responseFile, HttpStatus.OK);
    }

    @PostMapping("/client/directory/add")
    public ResponseEntity<HttpStatus> addFolder(@RequestBody FileElement fileElement, HttpServletRequest request){
        boolean status = clientAccessService.userAccessCheck(request.getRemoteUser(), request.getRemoteAddr());
        if (!status){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Domain not allowed.");
        }
        fileService.addFolder(fileElement);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/client/directory/remove")
    public ResponseEntity<HttpStatus> removeFile(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request){
        boolean status = clientAccessService.userAccessCheck(request.getRemoteUser(), request.getRemoteAddr());
        if (!status){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Domain not allowed.");
        }
        fileService.removeFile(deleteRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/client/directory/update")
    public ResponseEntity<HttpStatus> renameFile(@RequestBody RenameRequest renameRequest, HttpServletRequest request){
        boolean status = clientAccessService.userAccessCheck(request.getRemoteUser(), request.getRemoteAddr());
        if (!status){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Domain not allowed.");
        }
        fileService.renameFile(renameRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/client/directory/move")
    public ResponseEntity<HttpStatus> moveFile(@RequestBody MoveRequest moveRequest, HttpServletRequest request){
        boolean status = clientAccessService.userAccessCheck(request.getRemoteUser(), request.getRemoteAddr());
        if (!status){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Domain not allowed.");
        }
        fileService.moveFile(moveRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/client/file/upload")
    public ResponseEntity<HttpStatus> uploadFile(@RequestParam MultipartFile file, @RequestParam String path, HttpServletRequest request){
        boolean status = clientAccessService.userAccessCheck(request.getRemoteUser(), request.getRemoteAddr());
        if (!status){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Domain not allowed.");
        }
        String realPath = path.replaceAll("#", "/");
        try {
            fileService.addFile(file, realPath);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/client/file/replace")
    public ResponseEntity<HttpStatus> replaceFile(@RequestParam MultipartFile file, @RequestParam String path, HttpServletRequest request){
        boolean status = clientAccessService.userAccessCheck(request.getRemoteUser(), request.getRemoteAddr());
        if (!status){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Domain not allowed.");
        }
        String realPath = path.replaceAll("#", "/");
        try {
            fileService.replaceFile(file, realPath);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/client/file/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam String path, HttpServletRequest request) {
        boolean status = clientAccessService.userAccessCheck(request.getRemoteUser(), request.getRemoteAddr());
        if (!status){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Domain not allowed.");
        }
        FileElement file = fileService.findFile(null, path.replaceAll("#", "/"), false);
        Resource resource = new ByteArrayResource(file.getFile());
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_TYPE, "text/plain");
        headers.set(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(file.getName()).build().toString());
        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }

}

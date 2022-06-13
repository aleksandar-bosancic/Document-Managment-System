package com.dms.backend.documents.controllers;

import com.dms.backend.documents.model.Log;
import com.dms.backend.documents.services.LogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LogsController {
    private final LogService service;

    LogsController(LogService service){
        this.service = service;
    }

    @GetMapping("/admin/get-logs/{username}")
    public List<Log> getLogs(@PathVariable String username){
        return service.getLogs(username);
    }

    @PostMapping("/logs/add")
    public void addLog(@RequestBody Log log){
        this.service.addLog(log);
    }
}

package com.dms.backend.documents.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {

    @GetMapping("/test")
    public String test(){
        return "test";
    }

    @GetMapping("/success")
    public String success(){
        return "Noice";
    }

    @GetMapping("/try")
    public String getTry(){
        return "Try";
    }
}

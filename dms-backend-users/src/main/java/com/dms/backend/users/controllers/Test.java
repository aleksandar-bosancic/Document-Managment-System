package com.dms.backend.users.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class Test {
    @CrossOrigin
    @GetMapping("/test")
    public String test(){
        System.out.println("testing");
        return "test";
    }

    @GetMapping("/test/kita")
    public String testkita(){
        return "test kita";
    }

    @GetMapping("/success")
    public String success(){
        return "Noice";
    }

    @GetMapping("/try")
    public String getTry(){
        System.out.println("trying");
        return "Try";
    }
}

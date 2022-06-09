package com.dms.backend.users.controllers;

import com.dms.backend.users.model.User;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class Test {
    KeycloakRestTemplate keycloakRestTemplate;

    public Test(KeycloakRestTemplate keycloakRestTemplate) {
        this.keycloakRestTemplate = keycloakRestTemplate;
    }

    @GetMapping("/test")
    public String test(){
        System.out.println("testing");
        return "test";
    }

    @GetMapping("/test/kita")
    public String testkita(){
        var list = keycloakRestTemplate.getForEntity("https://localhost:8443/admin/realms/dms/roles/application-client/users", User[].class);

        System.out.println(list.getBody()[0]);
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

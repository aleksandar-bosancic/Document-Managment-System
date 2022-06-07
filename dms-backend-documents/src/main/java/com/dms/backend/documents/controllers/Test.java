package com.dms.backend.documents.controllers;

import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class Test {
    KeycloakRestTemplate keycloakRestTemplate;

    public Test(KeycloakRestTemplate keycloakRestTemplate) {
        this.keycloakRestTemplate = keycloakRestTemplate;
    }

    @GetMapping("/test")
    public String test() {
        System.out.println("testing");
        return "test";
    }

    @GetMapping("/success")
    public String success() {
        System.out.println("succeeding");
        return "Noice";
    }

    @GetMapping("/try")
    public String getTry() {
        System.out.println("trying");
        return "Try";
    }

    @GetMapping("/users")
    public String getUsers(){
        var list = keycloakRestTemplate.getForEntity("https://localhost:8443/admin/realms/dms/roles/application-client/users", List.class);
        System.out.println(list);
        return "uspio";
    }
}

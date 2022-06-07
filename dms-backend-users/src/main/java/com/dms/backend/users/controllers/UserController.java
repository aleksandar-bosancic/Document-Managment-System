package com.dms.backend.users.controllers;

import com.dms.backend.users.model.entities.User;
import com.dms.backend.users.services.UserService;
import org.apache.logging.log4j.util.Strings;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("admin")
public class UserController {
    UserService userService;

    UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/users/{role}")
    public ResponseEntity<User[]> getClientUsers(@RequestHeader String authorization, @PathVariable String role) {
        if (role == null || role.equals(Strings.EMPTY)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        if (!role.matches("client|system-admin|document-admin")){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        var body = userService.getUsers(role);
        return new ResponseEntity<>(body, HttpStatus.OK);
    }

    @GetMapping("/users/update")
    public void letItBe(){
        System.out.println("asa");
    }

    @PostMapping("/users/update")
    public void updateUser(@RequestBody String body){
        System.out.println(body);
    }

    @DeleteMapping("/users/delete/{id}")
    public void deleteUser(@PathVariable String id){
        userService.deleteUser(id);

    }

    @PostMapping("/users/add")
    public void addUser(@RequestBody User user){
        userService.addUser(user);
    }
}

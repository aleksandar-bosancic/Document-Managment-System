package com.dms.backend.users.controllers;

import com.dms.backend.users.model.AddUser;
import com.dms.backend.users.model.User;
import com.dms.backend.users.model.entities.UserDomainEntity;
import com.dms.backend.users.repositories.UserDomainRepository;
import com.dms.backend.users.services.UserService;
import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("admin")
public class UserController {
    UserService userService;
    UserDomainRepository repository;

    UserController(UserService userService, UserDomainRepository repository){
        this.userService = userService;
        this.repository = repository;
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

    @PutMapping("/users/update")
    public void updateUser(@RequestBody User user){
        UserDomainEntity userDomain = new UserDomainEntity();
        userDomain.setUserId(user.getId());
        userDomain.setIpAddress(user.getAttributes().getAllowedDomains()[0]);
        repository.saveAndFlush(userDomain);
        userService.updateUser(user);
    }

    @DeleteMapping("/users/delete/{id}")
    public void deleteUser(@PathVariable String id){
        repository.deleteById(id);
        userService.deleteUser(id);
    }

    @PostMapping("/users/add")
    public void addUser(@RequestBody AddUser user){
        UserDomainEntity userDomain = new UserDomainEntity();
        User createdUser = userService.addUser(user);
        if (createdUser.getAttributes() != null && createdUser.getAttributes().getAllowedDomains() != null) {
            userDomain.setUserId(createdUser.getId());
            userDomain.setIpAddress(createdUser.getAttributes().getAllowedDomains()[0]);
            repository.saveAndFlush(userDomain);
        }
    }

    @PutMapping("/users/reset")
    public void resetPassword(@RequestBody User user){
        userService.resetPassword(user);
    }
}

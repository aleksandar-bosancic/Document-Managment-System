package com.dms.backend.documents.services;

import com.dms.backend.documents.model.entities.UserDomainEntity;
import com.dms.backend.documents.repositories.UserDomainRepository;
import org.springframework.stereotype.Service;

@Service
public class ClientAccessService {
    UserDomainRepository repository;

    ClientAccessService(UserDomainRepository repository){
        this.repository = repository;
    }

    public boolean userAccessCheck(String id, String ipAddress){
        UserDomainEntity userDomain = repository.findById(id).orElse(null);
        if (userDomain == null){
            return true;
        } else return userDomain.getIpAddress().equals(ipAddress);
    }
}

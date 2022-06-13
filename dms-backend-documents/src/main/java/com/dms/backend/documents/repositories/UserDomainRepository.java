package com.dms.backend.documents.repositories;

import com.dms.backend.documents.model.entities.UserDomainEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDomainRepository extends JpaRepository<UserDomainEntity, String> {

}

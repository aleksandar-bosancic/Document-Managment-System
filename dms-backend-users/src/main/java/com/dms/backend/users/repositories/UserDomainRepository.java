package com.dms.backend.users.repositories;

import com.dms.backend.users.model.entities.UserDomainEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDomainRepository extends JpaRepository<UserDomainEntity, String> {

}

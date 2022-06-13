package com.dms.backend.documents.repositories;

import com.dms.backend.documents.model.entities.LogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<LogEntity, Integer> {
}

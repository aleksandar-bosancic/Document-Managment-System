package com.dms.backend.documents.services;

import com.dms.backend.documents.model.Log;
import com.dms.backend.documents.model.entities.LogEntity;
import com.dms.backend.documents.repositories.LogRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {
    private final LogRepository repository;
    private final ModelMapper mapper;

    LogService(LogRepository repository, ModelMapper mapper){
        this.repository = repository;
        this.mapper = mapper;
    }

    public void addLog(Log log){
        repository.save(mapper.map(log, LogEntity.class));
    }

    public List<Log> getLogs(String username){
        return repository.findAll().stream().filter(log -> log.getUsername().equals(username))
                .map(logEntity -> mapper.map(logEntity, Log.class)).toList();
    }
}

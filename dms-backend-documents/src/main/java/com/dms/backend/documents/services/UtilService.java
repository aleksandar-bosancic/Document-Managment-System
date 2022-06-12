package com.dms.backend.documents.services;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class UtilService {
    FileService fileService;

    UtilService(FileService fileService){
        this.fileService = fileService;
    }
}

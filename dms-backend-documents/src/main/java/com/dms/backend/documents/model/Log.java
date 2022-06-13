package com.dms.backend.documents.model;

import lombok.Data;

import java.sql.Timestamp;
import java.time.Instant;

@Data
public class Log {
    String action;
    String username;
    String fileName;
    Timestamp time;
}

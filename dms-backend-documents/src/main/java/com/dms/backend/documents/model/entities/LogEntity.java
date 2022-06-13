package com.dms.backend.documents.model.entities;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;

@Data
@Entity
@Table(name = "log")
public class LogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    int id;
    @Basic
    @Column(name = "time")
    Timestamp time;
    @Basic
    @Column(name = "action")
    String action;
    @Basic
    @Column(name = "username")
    String username;
    @Basic
    @Column(name = "file_name")
    String fileName;
}

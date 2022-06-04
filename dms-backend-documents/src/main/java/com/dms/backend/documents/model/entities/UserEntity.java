package com.dms.backend.documents.model.entities;

import com.dms.backend.documents.model.Type;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "user")
public class UserEntity {
    @Id@Column(name = "id", nullable = false)
    private Integer id;
    @Basic@Column(name = "username", nullable = false, length = 50)
    private String username;
    @Basic@Column(name = "password", nullable = false, length = 50)
    private String password;
    @Basic@Column(name = "type", nullable = false)
    private Type type;
}

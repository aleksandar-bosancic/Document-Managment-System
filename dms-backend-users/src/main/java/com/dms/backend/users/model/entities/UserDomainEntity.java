package com.dms.backend.users.model.entities;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "user_domain")
public class UserDomainEntity {
    @Id
    @Column(name = "user_id")
    String UserId;
    @Basic
    @Column(name = "ip_address")
    String IpAddress;
}

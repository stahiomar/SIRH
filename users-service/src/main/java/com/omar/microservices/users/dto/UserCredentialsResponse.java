package com.omar.microservices.users.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserCredentialsResponse {
    private String username;
    private String password;

    // Constructors, getters, and setters

}
package com.omar.microservices.users.dto;

import com.omar.microservices.users.model.ROLE;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public record UserRegistrationRequest(Integer id, String username, String password, String firstName, String lastName, String address, String email, String team, ROLE role, Integer solde) {
}

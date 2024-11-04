package com.omar.microservices.users.dto;

import com.omar.microservices.users.model.ROLE;

import java.time.LocalDate;

public record UserRegistrationResponse(Integer id, String username, String password, String firstName, String lastName, String address, String email, String team, ROLE role, LocalDate integrationDate, Integer solde) {
}

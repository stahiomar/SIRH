package com.omar.microservices.users.controller;

import com.omar.microservices.users.dto.*;
import com.omar.microservices.users.model.User;
import com.omar.microservices.users.repository.UserRepository;
import com.omar.microservices.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    //@PreAuthorize("hasRole('ADMIN')")
    public UserRegistrationResponse createUser(@RequestBody UserRegistrationRequest userRequest) {
        return userService.createUser(userRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    //@PreAuthorize("hasRole('ADMIN')")
    public List<UserRegistrationResponse> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserRegistrationResponse getAuthenticatedUser(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userService.loadUserByUsername(userDetails.getUsername());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            return new UserRegistrationResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getAddress(),
                    user.getEmail(),
                    user.getTeam(),
                    user.getRole(),
                    user.getIntegrationDate(),
                    user.getSolde()
            );
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    @GetMapping("/credentials")
    public ResponseEntity<UserCredentialsResponse> getUserCredentials(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null) {
            // You may create a custom response DTO to handle the user credentials
            UserCredentialsResponse response = new UserCredentialsResponse(userDetails.getUsername(), userDetails.getPassword());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<UserRegistrationResponse> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> optionalUser = userService.loadUserByUsername(loginRequest.getUsername());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Compare provided password with the stored hashed password
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.ok(new UserRegistrationResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getPassword(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getAddress(),
                        user.getEmail(),
                        user.getTeam(),
                        user.getRole(),
                        user.getIntegrationDate(),
                        user.getSolde()
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }



    @PutMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserRegistrationResponse updateAuthenticatedUser(@AuthenticationPrincipal UserDetails userDetails,
                                                            @RequestBody UserRegistrationRequest updatedUserRequest) {
        Optional<User> optionalUser = userService.loadUserByUsername(userDetails.getUsername());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Update the user's details
            user.setUsername(updatedUserRequest.username());
            user.setPassword(updatedUserRequest.password());
            user.setEmail(updatedUserRequest.email());
            user.setTeam(updatedUserRequest.team());
            user.setRole(updatedUserRequest.role());
            user.setAddress(updatedUserRequest.address());

            User updatedUser = userRepository.save(user);

            return new UserRegistrationResponse(
                    updatedUser.getId(),
                    updatedUser.getUsername(),
                    updatedUser.getPassword(),
                    updatedUser.getFirstName(),
                    updatedUser.getLastName(),
                    updatedUser.getAddress(),
                    updatedUser.getEmail(),
                    updatedUser.getTeam(),
                    updatedUser.getRole(),
                    updatedUser.getIntegrationDate(),
                    updatedUser.getSolde()
            );
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    //@PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUserById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    //@PreAuthorize("hasRole('ADMIN')")
    public UserRegistrationResponse updateUser(
            @PathVariable Integer id,
            @RequestBody UserRegistrationRequest updatedUserRequest) {
        return userService.updateUser(id, updatedUserRequest);
    }

    @GetMapping("/me/solde")
    public ResponseEntity<Integer> getUserSolde(@AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        return ResponseEntity.ok(user.getSolde());
    }



}
package com.omar.microservices.users.service;

import com.omar.microservices.users.dto.UserRegistrationRequest;
import com.omar.microservices.users.dto.UserRegistrationResponse;
import com.omar.microservices.users.model.User;
import com.omar.microservices.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    int solde = (int) (1.75 * (12 - LocalDate.now().getMonthValue() + 1));

    public UserRegistrationResponse createUser(UserRegistrationRequest userRequest) {
        User user = User.builder()
                .username(userRequest.firstName()+"_"+userRequest.lastName())
                .password(passwordEncoder.encode(userRequest.password()))
                .firstName(userRequest.firstName())
                .lastName(userRequest.lastName())
                .address(userRequest.address())
                .email(userRequest.email())
                .team(userRequest.team())
                .integrationDate(LocalDate.now())
                .role(userRequest.role())
                .solde((int) Math.ceil(solde))
                .build();
        userRepository.save(user);
        return new UserRegistrationResponse(user.getId(), user.getUsername(), user.getPassword(), user.getFirstName(), user.getLastName(), user.getAddress(), user.getEmail(), user.getTeam(), user.getRole(), user.getIntegrationDate(), user.getSolde());

    }

    public List<UserRegistrationResponse> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(user -> new UserRegistrationResponse(user.getId(), user.getUsername(), user.getPassword(), user.getFirstName(), user.getLastName(), user.getAddress(), user.getEmail(), user.getTeam(), user.getRole(), user.getIntegrationDate(), user.getSolde()))
                .toList();
    }

    public Optional<User> loadUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUserById(Integer id) {
        userRepository.deleteById(id);
    }

    public UserRegistrationResponse updateUser(Integer id, UserRegistrationRequest updatedUserRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Update fields
        user.setFirstName(updatedUserRequest.firstName());
        user.setLastName(updatedUserRequest.lastName());
        user.setAddress(updatedUserRequest.address());
        user.setEmail(updatedUserRequest.email());
        user.setTeam(updatedUserRequest.team());
        user.setRole(updatedUserRequest.role());

        User updatedUser = userRepository.save(user);

        // Return the updated User as a UserRegistrationResponse
        return new UserRegistrationResponse(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getPassword(),
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getAddress(),
                updatedUser.getEmail(),
                updatedUser.getTeam(),
                updatedUser.getRole(), // Directly pass the ROLE enum
                updatedUser.getIntegrationDate(),
                updatedUser.getSolde()
        );
    }






}
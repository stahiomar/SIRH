package com.omar.microservices.users.security;

import com.omar.microservices.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true)  // Enable method-level security
public class SecurityConfig {

    private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/users/**").authenticated()
                                .anyRequest().authenticated()
                )
                .formLogin()
                .defaultSuccessUrl("http://localhost:3001/", true)
                .and()
                .httpBasic()
                .and()
                .cors()
                .and()
                .logout(logout -> logout
                        .logoutUrl("/logout")  // Specify the logout URL
                        .logoutSuccessUrl("/login")  // Redirect to login after logout
                        .invalidateHttpSession(true)  // Invalidate the session
                        .clearAuthentication(true)  // Clear authentication
                        .deleteCookies("JSESSIONID")  // Delete the session cookie
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // In-memory users
        UserDetails user = User.builder()
                .username("employee")
                .password(passwordEncoder().encode("password"))
                .roles("EMPLOYEE")
                .build();

        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder().encode("admin123"))
                .roles("ADMIN")
                .build();

        InMemoryUserDetailsManager inMemoryUserDetailsManager = new InMemoryUserDetailsManager(user, admin);

        // Return a combined UserDetailsService
        return username -> {
            try {
                return inMemoryUserDetailsManager.loadUserByUsername(username);
            } catch (UsernameNotFoundException e) {
                return userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }

}
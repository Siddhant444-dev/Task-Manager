package com.siddhant.taskmanagerapp.service.impl;

import com.siddhant.taskmanagerapp.dtos.AuthResponse;
import com.siddhant.taskmanagerapp.dtos.LoginRequest;
import com.siddhant.taskmanagerapp.dtos.RegisterRequest;
import com.siddhant.taskmanagerapp.entity.User;
import com.siddhant.taskmanagerapp.exception.InvalidCredentialsException;
import com.siddhant.taskmanagerapp.exception.UserAlreadyExistsException;
import com.siddhant.taskmanagerapp.repository.UserRepository;
import com.siddhant.taskmanagerapp.security.JwtService;
import com.siddhant.taskmanagerapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(savedUser.getEmail())
                .password(savedUser.getPassword())
                .authorities("USER")
                .build();

        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .message("User registered successfully")
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .token(jwtToken)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("USER")
                .build();

        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .message("Login successful")
                .username(user.getUsername())
                .email(user.getEmail())
                .token(jwtToken)
                .build();
    }
}
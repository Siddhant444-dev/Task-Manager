package com.siddhant.taskmanagerapp.service;

import com.siddhant.taskmanagerapp.dtos.AuthResponse;
import com.siddhant.taskmanagerapp.dtos.LoginRequest;
import com.siddhant.taskmanagerapp.dtos.RegisterRequest;


public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}

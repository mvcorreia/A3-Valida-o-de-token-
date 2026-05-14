package com.buynow.backend.controller;

import com.buynow.backend.dto.LoginRequestDTO;
import com.buynow.backend.dto.LoginResponseDTO;
import com.buynow.backend.dto.RegisterRequestDTO;
import com.buynow.backend.entity.User;
import com.buynow.backend.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:8081")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequestDTO dto) {

        return authService.register(dto);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {

        return authService.login(dto);
    }
}
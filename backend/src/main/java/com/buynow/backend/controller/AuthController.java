package com.buynow.backend.controller;

import com.buynow.backend.dto.LoginRequestDTO;
import com.buynow.backend.dto.LoginResponseDTO;
import com.buynow.backend.dto.RegisterRequestDTO;
import com.buynow.backend.dto.UserResponseDTO;
import com.buynow.backend.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "https://a3-validador-frontend.onrender.com")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO dto) {
        try {
            UserResponseDTO user = authService.register(dto);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {
            LoginResponseDTO response = authService.login(dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
package com.buynow.backend.controller;

import com.buynow.backend.dto.LoginRequestDTO;
import com.buynow.backend.dto.LoginResponseDTO;
import com.buynow.backend.dto.RegisterRequestDTO;
import com.buynow.backend.dto.UserResponseDTO;
import com.buynow.backend.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.OPTIONS})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Método explícito para responder ao Preflight (OPTIONS) do navegador sem dar 405
    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
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
            // Retorna um JSON estruturado para o front-end não quebrar ao ler a resposta
            java.util.Map<String, String> errorMap = new java.util.HashMap<>();
            errorMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMap);
        }
    }
}
package com.buynow.backend.service;

import com.buynow.backend.dto.LoginRequestDTO;
import com.buynow.backend.dto.LoginResponseDTO;
import com.buynow.backend.dto.RegisterRequestDTO;
import com.buynow.backend.dto.UserResponseDTO;
import com.buynow.backend.entity.User;
import com.buynow.backend.repository.UserRepository;
import com.buynow.backend.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO register(RegisterRequestDTO dto) {

        // 🔒 evita email duplicado
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        User user = new User(
                dto.getName(),
                dto.getEmail(),
                passwordEncoder.encode(dto.getPassword())
        );

        User savedUser = userRepository.save(user);

        // 🔥 nunca retornar senha
        return mapToResponse(savedUser);
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponseDTO(token);
    }

    // 🔧 helper pra evitar repetição
    private UserResponseDTO mapToResponse(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}
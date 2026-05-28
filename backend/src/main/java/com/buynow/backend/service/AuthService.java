package com.buynow.backend.service;

import com.buynow.backend.dto.LoginRequestDTO;
import com.buynow.backend.dto.LoginResponseDTO;
import com.buynow.backend.dto.RegisterRequestDTO;
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

    public User register(RegisterRequestDTO dto) {

        User user = new User(
                dto.getName(),
                dto.getEmail(),
                passwordEncoder.encode(dto.getPassword())
        );

        return userRepository.save(user);
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        Optional<User> userOptional =
                userRepository.findByEmail(dto.getEmail());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(
                dto.getPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException("Senha inválida");
        }

        String token =
                jwtService.generateToken(user.getEmail());

        return new LoginResponseDTO(token);
    }
}
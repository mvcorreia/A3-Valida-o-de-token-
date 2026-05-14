package com.buynow.backend.service;

import com.buynow.backend.dto.LoginRequestDTO;
import com.buynow.backend.dto.LoginResponseDTO;
import com.buynow.backend.dto.RegisterRequestDTO;
import com.buynow.backend.entity.User;
import com.buynow.backend.repository.UserRepository;
import com.buynow.backend.security.JwtService;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public User register(RegisterRequestDTO dto) {

        User user = new User(
                dto.getName(),
                dto.getEmail(),
                dto.getPassword()
        );

        return userRepository.save(user);
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        Optional<User> user = userRepository.findByEmail(dto.getEmail());

        if (user.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }

        if (!user.get().getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = jwtService.generateToken(user.get().getEmail());

        return new LoginResponseDTO(token);
    }
}
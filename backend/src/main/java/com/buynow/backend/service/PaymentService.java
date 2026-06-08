package com.buynow.backend.service;

import com.buynow.backend.security.EmailService;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PaymentService {

    private final EmailService emailService;

    // O 'volatile' garante que o valor seja compartilhado entre as requisições no Render
    private volatile String currentToken;

    public PaymentService(EmailService emailService) {
        this.emailService = emailService;
    }

    public String processPayment(Double amount, String email) {
        try {
            String token = generateToken();

            // Salva na memória do servidor
            this.currentToken = token;

            emailService.sendToken(email, token);

            return "Pagamento processado! Token enviado para o email.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Erro ao enviar email";
        }
    }

    public String validateToken(String token) {
        if (token == null || currentToken == null) {
            return "Token inválido!";
        }

        // O .trim() remove espaços invisíveis que o front-end possa enviar sem querer
        if (token.trim().equals(currentToken.trim())) {
            this.currentToken = null; // Limpa o token após o sucesso por segurança
            return "Pagamento aprovado!";
        }

        return "Token inválido!";
    }

    private String generateToken() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }
}
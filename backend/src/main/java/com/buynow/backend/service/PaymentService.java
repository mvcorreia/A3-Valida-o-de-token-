package com.buynow.backend.service;

import com.buynow.backend.security.EmailService;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PaymentService {

    private final EmailService emailService;

    
    private String currentToken;

    public PaymentService(EmailService emailService) {
        this.emailService = emailService;
    }

    public String processPayment(Double amount, String email) {

        try {
            
            String token = generateToken();

            
            this.currentToken = token;

            
            emailService.sendToken(email, token);

            return "Pagamento processado! Token enviado para o email.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Erro ao enviar email";
        }
    }

    public String validateToken(String token) {

        if (token.equals(currentToken)) {
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
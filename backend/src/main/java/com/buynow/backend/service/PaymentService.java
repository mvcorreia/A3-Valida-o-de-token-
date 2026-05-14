package com.buynow.backend.service;

import com.buynow.backend.security.EmailService;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PaymentService {

    private final EmailService emailService;

    private String generatedToken;

    public PaymentService(EmailService emailService) {
        this.emailService = emailService;
    }

    public String processPayment(Double amount, String userEmail) {

        Random random = new Random();

        int token = 100000 + random.nextInt(900000);

        generatedToken = String.valueOf(token);

        System.out.println("TOKEN GERADO: " + generatedToken);

        try {

            emailService.sendToken(userEmail, generatedToken);

        } catch (Exception e) {

            throw new RuntimeException("Erro ao enviar email");
        }

        return "Token enviado para o email";
    }

    public String validateToken(String token) {

        if (generatedToken == null) {

            return "Nenhum token gerado";
        }

        if (generatedToken.equals(token)) {

            generatedToken = null;

            return "Compra aprovada com sucesso";
        }

        return "Token inválido";
    }
}
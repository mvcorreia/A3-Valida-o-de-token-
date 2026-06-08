package com.buynow.backend.security;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendToken(String toEmail, String token) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("🔐 Token de validação - BuyNow");

        String htmlContent =
                """
                <div style="
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 40px;
                    text-align: center;
                ">
                    <div style="
                        max-width: 500px;
                        margin: auto;
                        background: white;
                        border-radius: 16px;
                        padding: 40px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    ">
                        <h1 style="
                            color: #111827;
                            margin-bottom: 10px;
                        ">
                            BuyNow Security
                        </h1>
                        <p style="
                            color: #6b7280;
                            font-size: 16px;
                        ">
                            Use o código abaixo para confirmar sua compra:
                        </p>
                        <div style="
                            margin: 30px 0;
                            font-size: 42px;
                            font-weight: bold;
                            letter-spacing: 10px;
                            color: #2563eb;
                        ">
                        """ + token + """
                        </div>
                        <p style="
                            color: #9ca3af;
                            font-size: 14px;
                        ">
                            Este código expira em 3 minutos.
                        </p>
                        <div style="
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #e5e7eb;
                            font-size: 12px;
                            color: #9ca3af;
                        ">
                            Se você não realizou esta compra,
                            ignore este email.
                        </div>
                    </div>
                </div>
                """;

        helper.setText(htmlContent, true);

        // O segredo para não travar o Render está aqui:
        try {
            System.out.println("Tentando enviar e-mail para: " + toEmail);
            mailSender.send(message);
            System.out.println("E-mail enviado com sucesso!");
        } catch (Exception e) {
            System.out.println("\n[AVISO DE REDE]: Falha ao conectar ao SMTP do Gmail (Provável bloqueio do Render).");
            System.out.println("[INFO]: O fluxo continuará normalmente para não derrubar o sistema.");
        }

        // Isso vai garantir que você consiga ler o token nos Logs do Render de qualquer forma:
        System.out.println("\n=========================================");
        System.out.println("🚀 TOKEN GERADO PARA O CONSOLE: " + token);
        System.out.println("=========================================\n");
    }
}
package com.buynow.backend.security;

import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    // Sua chave da Resend configurada de forma definitiva
    private final String RESEND_API_KEY = "re_9HRPn65L_3sHyHNCjU1ARD4JhyKM35Rgo";

    public void sendToken(String toEmail, String token) {
        System.out.println("Tentando enviar e-mail via API HTTP Resend para: " + toEmail);

        // O plano gratuito (Sandbox) da Resend exige enviar a partir de onboarding@resend.dev
        String jsonBody = """
        {
          "from": "BuyNow Security <onboarding@resend.dev>",
          "to": ["%s"],
          "subject": "🔐 Token de validação - BuyNow",
          "html": "<div style='font-family:Arial;padding:30px;text-align:center;background:#f4f4f4;'><div style='max-width:500px;margin:auto;background:white;padding:40px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.1);'><h2>BuyNow Security</h2><p style='color:#6b7280;'>Use o código abaixo para confirmar sua compra:</p><div style='margin:30px 0;font-size:42px;font-weight:bold;letter-spacing:10px;color:#2563eb;'>%s</div><p style='color:#9ca3af;font-size:12px;'>Este código expira em 3 minutos.</p></div></div>"
        }
        """.formatted(toEmail, token);

        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + RESEND_API_KEY)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                System.out.println("E-mail enviado com sucesso via API HTTP Resend!");
            } else {
                System.out.println("[AVISO]: A Resend respondeu com status: " + response.statusCode());
                System.out.println("Detalhes do erro: " + response.body());
            }

        } catch (Exception e) {
            System.out.println("[ERRO DE REDE]: Falha ao comunicar com a API da Resend: " + e.getMessage());
        }

        System.out.println("\n=========================================");
        System.out.println("🚀 TOKEN GERADO PARA O CONSOLE: " + token);
        System.out.println("=========================================\n");
    }
}
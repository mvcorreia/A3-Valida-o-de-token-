package com.buynow.backend.controller;

import com.buynow.backend.dto.PaymentRequestDTO;
import com.buynow.backend.dto.TokenValidationDTO;
import com.buynow.backend.service.PaymentService;

import java.util.HashMap;
import java.util.Map; 

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "https://a3-validador-frontend.onrender.com", allowedHeaders = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/checkout")
    public String checkout(@RequestBody PaymentRequestDTO dto) {
        return paymentService.processPayment(
                dto.getAmount(),
                dto.getEmail()
        );
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody TokenValidationDTO dto) {
        String result = paymentService.validateToken(dto.getToken());

        Map<String, String> response = new HashMap<>();
        response.put("message", result);

        if (result.equals("Pagamento aprovado!")) {
            return ResponseEntity.ok(response); 
        }

        return ResponseEntity.badRequest().body(response);
    }
}
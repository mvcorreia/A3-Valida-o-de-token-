package com.buynow.backend.controller;

import com.buynow.backend.dto.PaymentRequestDTO;
import com.buynow.backend.dto.TokenValidationDTO;
import com.buynow.backend.service.PaymentService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "https://a3-validador-frontend.onrender.com")
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
    public String validateToken(@RequestBody TokenValidationDTO dto) {

        return paymentService.validateToken(dto.getToken());
    }
}
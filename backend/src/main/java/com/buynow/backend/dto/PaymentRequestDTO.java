package com.buynow.backend.dto;

public class PaymentRequestDTO {

    private Double amount;

    private String email;

    public PaymentRequestDTO() {
    }

    public Double getAmount() {
        return amount;
    }

    public String getEmail() {
        return email;
    }
}
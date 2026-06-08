package com.buynow.backend.dto;

public class TokenValidationDTO {

    private String token;

    // Construtor padrão (Obrigatório para o Jackson funcionar!)
    public TokenValidationDTO() {
    }

    public TokenValidationDTO(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    // Adicione o Setter se não tiver (Ajuda o Jackson a injetar o valor)
    public void setToken(String token) {
        this.token = token;
    }
}
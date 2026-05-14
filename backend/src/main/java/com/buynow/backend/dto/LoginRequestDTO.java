package com.buynow.backend.dto;

public class LoginRequestDTO {

    private String email;
    private String password;

    public LoginRequestDTO() {
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
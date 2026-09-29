package com.kolkata.restaurant.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = {
                "http://localhost:5500",
                "http://127.0.0.1:5500",
                "https://kolkata-victoria-chat-house-production.up.railway.app"
        },
        allowCredentials = "true"
)
public class AdminLoginController {

    private final AuthenticationManager authenticationManager;

    private final SecurityContextRepository securityContextRepository =
            new HttpSessionSecurityContextRepository();


    // =========================
    // CONSTRUCTOR
    // =========================

    public AdminLoginController(
            AuthenticationManager authenticationManager) {

        this.authenticationManager =
                authenticationManager;
    }


    // =========================
    // ADMIN LOGIN
    // =========================

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody Map<String, String> loginData,
            HttpServletRequest request,
            HttpServletResponse response) {

        String username =
                loginData.get("username");

        String password =
                loginData.get("password");


        Map<String, Object> result =
                new HashMap<>();


        try {

            // =========================
            // AUTHENTICATE USER
            // =========================

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    password
                            )
                    );


            // =========================
            // CREATE SECURITY CONTEXT
            // =========================

            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(
                    authentication
            );


            SecurityContextHolder.setContext(
                    context
            );


            // =========================
            // SAVE LOGIN IN SESSION
            // =========================

            securityContextRepository.saveContext(
                    context,
                    request,
                    response
            );


            // =========================
            // SUCCESS RESPONSE
            // =========================

            result.put(
                    "success",
                    true
            );

            result.put(
                    "message",
                    "Login successful"
            );


        } catch (Exception e) {

            // =========================
            // LOGIN FAILED
            // =========================

            result.put(
                    "success",
                    false
            );

            result.put(
                    "message",
                    "Invalid username or password"
            );

        }


        return result;
    }
}
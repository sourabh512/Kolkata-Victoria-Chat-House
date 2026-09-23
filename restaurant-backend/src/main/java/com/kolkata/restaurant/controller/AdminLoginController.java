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
                "http://127.0.0.1:5500"
        },
        allowCredentials = "true"
)
public class AdminLoginController {

    private final AuthenticationManager authenticationManager;

    private final SecurityContextRepository
            securityContextRepository =
            new HttpSessionSecurityContextRepository();


    public AdminLoginController(
            AuthenticationManager authenticationManager) {

        this.authenticationManager = authenticationManager;
    }


    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody Map<String, String> loginData,
            HttpServletRequest request,
            HttpServletResponse response) {

        String username = loginData.get("username");
        String password = loginData.get("password");

        Map<String, Object> result =
                new HashMap<>();


        try {

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    password
                            )
                    );


            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);

            SecurityContextHolder.setContext(context);


            securityContextRepository.saveContext(
                    context,
                    request,
                    response
            );


            result.put("success", true);

            result.put(
                    "message",
                    "Login successful"
            );


        } catch (Exception e) {

            result.put("success", false);

            result.put(
                    "message",
                    "Invalid username or password"
            );
        }


        return result;
    }
}
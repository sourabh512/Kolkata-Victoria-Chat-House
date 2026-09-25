package com.kolkata.restaurant.config;

import java.util.List;
import org.springframework.security.authentication.ProviderManager;
import com.kolkata.restaurant.security.AdminUserDetailsService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
public class SecurityConfig {

    // Password encryption
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // Connect AdminUserDetailsService with Spring Security
    @Bean
    public AuthenticationProvider authenticationProvider(
            AdminUserDetailsService adminUserDetailsService,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        adminUserDetailsService
                );

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }


    // Authentication manager
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5500",
                "http://127.0.0.1:5500",
                "https://resplendent-solace-production-a0b3.up.railway.app"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // Security rules
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http
                .cors(cors -> {})

                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Browser preflight
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Login
                        .requestMatchers(
                                "/api/login"
                        ).permitAll()

                        // Logout
                        .requestMatchers(
                                "/api/logout"
                        ).permitAll()

                        // Customer places order
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/orders"
                        ).permitAll()

                                // Customer can track one order
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/orders/*"
                                ).permitAll()

// Admin views all orders
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/orders"
                                ).authenticated()
                        // Admin changes order status
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/orders/**"
                        ).authenticated()
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/menu",
                                "/api/menu/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/menu"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/menu/**"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/menu/**"
                        ).authenticated()
                        .anyRequest().permitAll()
                )


                // LOGOUT
                .logout(logout -> logout

                        .logoutUrl("/api/logout")

                        .logoutSuccessHandler(
                                (request, response, authentication) -> {
                                    response.setStatus(200);
                                }
                        )

                        .invalidateHttpSession(true)

                        .deleteCookies("JSESSIONID")
                );


        return http.build();
    }
}
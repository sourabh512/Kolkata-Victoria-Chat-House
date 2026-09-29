package com.kolkata.restaurant.config;

import java.util.List;

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

    // =========================
    // PASSWORD ENCODER
    // =========================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }


    // =========================
    // AUTHENTICATION PROVIDER
    // =========================

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


    // =========================
    // AUTHENTICATION MANAGER
    // =========================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();

    }


    // =========================
    // CORS CONFIGURATION
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(List.of(

                // Local frontend
                "http://localhost:5500",

                // Local frontend
                "http://127.0.0.1:5500",

                // Railway frontend
                "https://kolkata-victoria-chat-house-production.up.railway.app"

        ));


        configuration.setAllowedMethods(List.of(

                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"

        ));


        configuration.setAllowedHeaders(
                List.of("*")
        );


        configuration.setAllowCredentials(true);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }


    // =========================
    // SECURITY RULES
    // =========================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http

                // Enable CORS
                .cors(cors -> {})

                // Disable CSRF
                .csrf(csrf -> csrf.disable())


                .authorizeHttpRequests(auth -> auth


                        // =========================
                        // CORS PREFLIGHT
                        // =========================

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()


                        // =========================
                        // ADMIN LOGIN
                        // =========================

                        .requestMatchers(
                                "/api/login"
                        ).permitAll()


                        // =========================
                        // LOGOUT
                        // =========================

                        .requestMatchers(
                                "/api/logout"
                        ).permitAll()


                        // =========================
                        // CUSTOMER PLACE ORDER
                        // =========================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/orders"
                        ).permitAll()


                        // =========================
                        // CUSTOMER TRACK ORDER
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders/*"
                        ).permitAll()


                        // =========================
                        // ADMIN VIEW ALL ORDERS
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders"
                        ).authenticated()


                        // =========================
                        // ADMIN UPDATE ORDER
                        // =========================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/orders/**"
                        ).authenticated()


                        // =========================
                        // CUSTOMER VIEW MENU
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/menu",
                                "/api/menu/**"
                        ).permitAll()


                        // =========================
                        // ADMIN ADD MENU
                        // =========================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/menu"
                        ).authenticated()


                        // =========================
                        // ADMIN UPDATE MENU
                        // =========================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/menu/**"
                        ).authenticated()


                        // =========================
                        // ADMIN DELETE MENU
                        // =========================

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/menu/**"
                        ).authenticated()


                        // =========================
                        // OTHER REQUESTS
                        // =========================

                        .anyRequest().permitAll()

                )


                // =========================
                // LOGOUT
                // =========================

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
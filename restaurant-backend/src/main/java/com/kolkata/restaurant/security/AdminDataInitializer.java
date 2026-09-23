package com.kolkata.restaurant.security;

import com.kolkata.restaurant.model.AdminUser;
import com.kolkata.restaurant.repository.AdminUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            AdminUserRepository repository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (repository.findByUsername("admin").isEmpty()) {

                AdminUser admin = new AdminUser();

                admin.setUsername("admin");

                admin.setPassword(
                        passwordEncoder.encode("admin123")
                );

                repository.save(admin);

                System.out.println(
                        "Admin user created successfully!"
                );

            }
        };
    }
}
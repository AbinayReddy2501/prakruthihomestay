package com.prakruthi.homestay.config;

import com.prakruthi.homestay.model.User;
import com.prakruthi.homestay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if admins already exist
        if (userRepository.findByUsername("sreekar").isEmpty() && 
            userRepository.findByUsername("abinay").isEmpty()) {
            
            // Create admin profiles
            List<User> admins = Arrays.asList(
                createAdmin(
                    "sreekar",
                    "Sreekar@1108",
                    "Sreekar",
                    "sreekar@prakruthihomestay.com",
                    "+91 9876543210"
                ),
                createAdmin(
                    "abinay",
                    "Abinay@2501",
                    "Abinay",
                    "abinay@prakruthihomestay.com",
                    "+91 9876543211"
                )
            );

            // Save admins to database
            userRepository.saveAll(admins);
            System.out.println("Admin profiles created successfully!");
        }
    }

    private User createAdmin(String username, String password, String fullName, String email, String phone) {
        User admin = new User();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setFullName(fullName);
        admin.setEmail(email);
        admin.setPhoneNumber(phone);
        admin.setRole("ADMIN");
        admin.setEnabled(true);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        
        // Create default address
        User.Address address = new User.Address();
        address.setStreet("123 Main Street");
        address.setCity("Bangalore");
        address.setState("Karnataka");
        address.setCountry("India");
        address.setZipCode("560001");
        admin.setAddress(address);

        return admin;
    }
}

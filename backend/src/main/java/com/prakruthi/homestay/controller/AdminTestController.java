package com.prakruthi.homestay.controller;

import com.prakruthi.homestay.model.User;
import com.prakruthi.homestay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/test")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/verify")
    public ResponseEntity<?> verifyAdminAccess() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("username", currentUser.getUsername());
        response.put("role", currentUser.getRole());
        response.put("fullName", currentUser.getFullName());
        response.put("email", currentUser.getEmail());
        response.put("message", "Admin access verified successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<?> getAdminStatus() {
        long totalAdmins = userRepository.countByRole("ADMIN");
        Map<String, Object> response = new HashMap<>();
        response.put("totalAdmins", totalAdmins);
        response.put("adminAccounts", userRepository.findByRole("ADMIN"));
        return ResponseEntity.ok(response);
    }
}

package com.prakruthi.homestay.service;

import com.prakruthi.homestay.model.User;
import com.prakruthi.homestay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllEmployees() {
        return userRepository.findByRoleIn(List.of("MANAGER", "EMPLOYEE"));
    }

    @Transactional
    public User createEmployee(User employee) {
        if (userRepository.existsByUsername(employee.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        employee.setEnabled(true);
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(employee);
    }

    @Transactional
    public User updateEmployee(String id, User employeeDetails) {
        User employee = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setFullName(employeeDetails.getFullName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPhoneNumber(employeeDetails.getPhoneNumber());
        employee.setRole(employeeDetails.getRole());

        if (employeeDetails.getPassword() != null && !employeeDetails.getPassword().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(employeeDetails.getPassword()));
        }

        employee.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(employee);
    }

    @Transactional
    public void deleteEmployee(String id) {
        User employee = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employee.getRole().equals("ADMIN")) {
            throw new RuntimeException("Cannot delete admin user");
        }

        userRepository.delete(employee);
    }

    @Transactional
    public void resetPassword(String id, String newPassword) {
        User employee = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setPassword(passwordEncoder.encode(newPassword));
        employee.setUpdatedAt(LocalDateTime.now());
        userRepository.save(employee);
    }

    @Transactional
    public void toggleEmployeeStatus(String id) {
        User employee = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setEnabled(!employee.isEnabled());
        employee.setUpdatedAt(LocalDateTime.now());
        userRepository.save(employee);
    }
}

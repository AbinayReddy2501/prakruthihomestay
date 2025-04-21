package com.prakruthi.homestay.controller;

import com.prakruthi.homestay.model.User;
import com.prakruthi.homestay.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/employees")
@PreAuthorize("hasRole('ADMIN')")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<User>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @PostMapping
    public ResponseEntity<User> createEmployee(@RequestBody User employee) {
        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateEmployee(@PathVariable String id, @RequestBody User employee) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable String id, @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        employeeService.resetPassword(id, newPassword);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleEmployeeStatus(@PathVariable String id) {
        employeeService.toggleEmployeeStatus(id);
        return ResponseEntity.ok().build();
    }
}

package com.prakruthi.homestay.controller;

import com.prakruthi.homestay.model.Availability;
import com.prakruthi.homestay.model.User;
import com.prakruthi.homestay.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AvailabilityController {

    @Autowired
    private AvailabilityService availabilityService;

    @GetMapping("/public/availability")
    public ResponseEntity<List<Availability>> getPublicAvailability(
            @RequestParam String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(availabilityService.getAvailability(roomId, startDate, endDate));
    }

    @PostMapping("/admin/availability/set-available")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setAvailable(
            @RequestParam String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal User user) {
        availabilityService.setAvailability(roomId, startDate, endDate, true, null, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/availability/set-unavailable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setUnavailable(
            @RequestParam String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam String reason,
            @AuthenticationPrincipal User user) {
        availabilityService.setAvailability(roomId, startDate, endDate, false, reason, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/availability/bulk-update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bulkUpdate(
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal User user) {
        // Implementation for bulk updates
        return ResponseEntity.ok().build();
    }

    @GetMapping("/rooms/check-availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        boolean isAvailable = availabilityService.isRoomAvailable(roomId, startDate, endDate);
        return ResponseEntity.ok(isAvailable);
    }
}

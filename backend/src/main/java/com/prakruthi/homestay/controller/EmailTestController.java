package com.prakruthi.homestay.controller;

import com.prakruthi.homestay.model.Booking;
import com.prakruthi.homestay.model.Room;
import com.prakruthi.homestay.service.ResendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/test/email")
public class EmailTestController {

    @Autowired
    private ResendEmailService emailService;

    @PostMapping("/booking-confirmation")
    public ResponseEntity<?> testBookingConfirmation(@RequestBody Map<String, String> request) {
        try {
            // Create a test booking
            Booking booking = new Booking();
            booking.setBookingId("TEST-" + System.currentTimeMillis());
            
            Room room = new Room();
            room.setName("Luxury 2BHK Villa");
            booking.setRoom(room);
            
            Booking.GuestDetails guestDetails = new Booking.GuestDetails();
            guestDetails.setName(request.get("name"));
            guestDetails.setEmail(request.get("email"));
            booking.setGuestDetails(guestDetails);
            
            booking.setCheckInDate(LocalDate.now().plusDays(1));
            booking.setCheckOutDate(LocalDate.now().plusDays(3));
            booking.setTotalAmount(new BigDecimal("10000"));

            // Send test email
            emailService.sendBookingConfirmation(booking);
            
            return ResponseEntity.ok(Map.of(
                "message", "Booking confirmation email sent successfully",
                "email", request.get("email")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to send email: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/test-simple")
    public ResponseEntity<?> testSimpleEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("email");
            emailService.sendPasswordReset(to, "test-token-123");
            return ResponseEntity.ok(Map.of(
                "message", "Test email sent successfully",
                "email", to
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to send email: " + e.getMessage()
            ));
        }
    }
}

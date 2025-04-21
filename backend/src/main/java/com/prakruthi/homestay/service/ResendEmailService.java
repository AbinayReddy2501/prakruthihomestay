package com.prakruthi.homestay.service;

import com.prakruthi.homestay.model.Booking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class ResendEmailService {

    private final RestTemplate restTemplate;
    private final TemplateEngine templateEngine;
    private final String apiKey;
    private final String fromEmail;
    private final String fromName;

    public ResendEmailService(
            @Value("${resend.api.key}") String apiKey,
            @Value("${app.email.from}") String fromEmail,
            @Value("${app.email.name}") String fromName,
            TemplateEngine templateEngine) {
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
        this.fromName = fromName;
        this.templateEngine = templateEngine;
        this.restTemplate = new RestTemplate();
    }

    public void sendBookingConfirmation(Booking booking) {
        Context context = new Context();
        context.setVariables(Map.of(
            "booking", booking,
            "checkInDate", booking.getCheckInDate().format(DateTimeFormatter.ofPattern("MMM d, yyyy")),
            "checkOutDate", booking.getCheckOutDate().format(DateTimeFormatter.ofPattern("MMM d, yyyy")),
            "checkInTime", "1:00 PM",
            "checkOutTime", "11:00 AM",
            "guestName", booking.getGuestDetails().getName(),
            "bookingId", booking.getBookingId(),
            "totalAmount", booking.getTotalAmount(),
            "roomName", booking.getRoom().getName()
        ));

        String subject = "Booking Confirmation - Prakruthi Homestay";
        String content = templateEngine.process("booking-confirmation", context);
        sendEmail(booking.getGuestDetails().getEmail(), subject, content);
    }

    public void sendPasswordReset(String email, String resetToken) {
        Context context = new Context();
        context.setVariables(Map.of(
            "resetLink", "http://localhost:3000/reset-password?token=" + resetToken,
            "expiryHours", "24"
        ));

        String subject = "Password Reset - Prakruthi Homestay";
        String content = templateEngine.process("password-reset", context);
        sendEmail(email, subject, content);
    }

    private void sendEmail(String to, String subject, String htmlContent) {
        String url = "https://api.resend.com/emails";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("from", String.format("%s <%s>", fromName, fromEmail));
        body.put("to", to);
        body.put("subject", subject);
        body.put("html", htmlContent);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("Failed to send email: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error sending email", e);
        }
    }
}

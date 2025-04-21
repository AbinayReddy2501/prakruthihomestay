package com.prakruthi.homestay.service;

import com.prakruthi.homestay.model.Booking;
import com.sendgrid.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class SendGridEmailService {

    private final SendGrid sendGrid;
    private final TemplateEngine templateEngine;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.name}")
    private String fromName;

    public SendGridEmailService(
            @Value("${sendgrid.api.key}") String sendGridApiKey,
            TemplateEngine templateEngine) {
        this.sendGrid = new SendGrid(sendGridApiKey);
        this.templateEngine = templateEngine;
    }

    public void sendBookingConfirmation(Booking booking) throws IOException {
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

    public void sendPasswordReset(String email, String resetToken) throws IOException {
        Context context = new Context();
        context.setVariables(Map.of(
            "resetLink", "http://localhost:3000/reset-password?token=" + resetToken,
            "expiryHours", "24"
        ));

        String subject = "Password Reset - Prakruthi Homestay";
        String content = templateEngine.process("password-reset", context);
        sendEmail(email, subject, content);
    }

    private void sendEmail(String to, String subject, String htmlContent) throws IOException {
        Email from = new Email(fromEmail, fromName);
        Email toEmail = new Email(to);
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, toEmail, content);

        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sendGrid.api(request);
        if (response.getStatusCode() >= 400) {
            throw new IOException("Failed to send email: " + response.getBody());
        }
    }
}

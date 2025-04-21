package com.prakruthi.homestay.service;

import com.prakruthi.homestay.model.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.name}")
    private String fromName;

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

    public void sendBookingCancellation(Booking booking) {
        Context context = new Context();
        context.setVariables(Map.of(
            "booking", booking,
            "guestName", booking.getGuestDetails().getName(),
            "bookingId", booking.getBookingId(),
            "refundAmount", booking.getRefundDetails() != null && !booking.getRefundDetails().isEmpty() 
                ? booking.getRefundDetails().get(0).getAmount() 
                : "0"
        ));

        String subject = "Booking Cancellation - Prakruthi Homestay";
        String content = templateEngine.process("booking-cancellation", context);
        sendEmail(booking.getGuestDetails().getEmail(), subject, content);
    }

    public void sendCheckInReminder(Booking booking) {
        Context context = new Context();
        context.setVariables(Map.of(
            "booking", booking,
            "guestName", booking.getGuestDetails().getName(),
            "checkInDate", booking.getCheckInDate().format(DateTimeFormatter.ofPattern("MMM d, yyyy")),
            "checkInTime", "1:00 PM",
            "address", "Prakruthi Homestay, [Your Full Address]",
            "contactNumber", "+91 98765 43210"
        ));

        String subject = "Check-in Reminder - Prakruthi Homestay";
        String content = templateEngine.process("check-in-reminder", context);
        sendEmail(booking.getGuestDetails().getEmail(), subject, content);
    }

    public void sendCheckOutReminder(Booking booking) {
        Context context = new Context();
        context.setVariables(Map.of(
            "booking", booking,
            "guestName", booking.getGuestDetails().getName(),
            "checkOutDate", booking.getCheckOutDate().format(DateTimeFormatter.ofPattern("MMM d, yyyy")),
            "checkOutTime", "11:00 AM"
        ));

        String subject = "Check-out Reminder - Prakruthi Homestay";
        String content = templateEngine.process("check-out-reminder", context);
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

    private void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}

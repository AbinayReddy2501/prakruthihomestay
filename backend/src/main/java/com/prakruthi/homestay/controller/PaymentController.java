package com.prakruthi.homestay.controller;

import com.prakruthi.homestay.model.Booking;
import com.prakruthi.homestay.service.BookingService;
import com.prakruthi.homestay.service.RazorpayService;
import com.prakruthi.homestay.service.ResendEmailService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ResendEmailService emailService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, String> request) {
        try {
            String bookingId = request.get("bookingId");
            Booking booking = bookingService.getBooking(bookingId);
            
            if (booking == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Booking not found"
                ));
            }

            Map<String, Object> order = razorpayService.createOrder(booking);
            
            // Update booking with order ID
            booking.setRazorpayOrderId((String) order.get("orderId"));
            bookingService.updateBooking(booking);

            return ResponseEntity.ok(order);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to create payment order: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            String orderId = request.get("razorpay_order_id");
            String paymentId = request.get("razorpay_payment_id");
            String signature = request.get("razorpay_signature");

            boolean isValid = razorpayService.verifyPaymentSignature(orderId, paymentId, signature);
            
            if (!isValid) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid payment signature"
                ));
            }

            // Update booking status
            Booking booking = bookingService.getBookingByOrderId(orderId);
            if (booking != null) {
                booking.setRazorpayPaymentId(paymentId);
                booking.setStatus(Booking.BookingStatus.CONFIRMED);
                booking.setPaymentStatus("PAID");
                bookingService.updateBooking(booking);

                // Send confirmation email
                emailService.sendBookingConfirmation(booking);
            }

            return ResponseEntity.ok(Map.of(
                "message", "Payment verified successfully",
                "bookingId", booking != null ? booking.getBookingId() : null
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Payment verification failed: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/refund")
    public ResponseEntity<?> processRefund(@RequestBody Map<String, String> request) {
        try {
            String bookingId = request.get("bookingId");
            Booking booking = bookingService.getBooking(bookingId);
            
            if (booking == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Booking not found"
                ));
            }

            razorpayService.processRefund(booking.getRazorpayPaymentId(), booking.getTotalAmount());
            
            // Update booking status
            booking.setStatus(Booking.BookingStatus.REFUNDED);
            booking.setPaymentStatus("REFUNDED");
            bookingService.updateBooking(booking);

            return ResponseEntity.ok(Map.of(
                "message", "Refund processed successfully",
                "bookingId", bookingId
            ));
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to process refund: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/status/{paymentId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String paymentId) {
        try {
            Map<String, Object> paymentDetails = razorpayService.fetchPaymentDetails(paymentId);
            return ResponseEntity.ok(paymentDetails);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to fetch payment status: " + e.getMessage()
            ));
        }
    }
}

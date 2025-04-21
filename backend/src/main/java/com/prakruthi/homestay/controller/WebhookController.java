package com.prakruthi.homestay.controller;

import com.prakruthi.homestay.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/razorpay")
    public ResponseEntity<?> handleRazorpayWebhook(@RequestBody Map<String, Object> payload) {
        String event = (String) payload.get("event");
        
        switch (event) {
            case "payment.captured":
                handlePaymentCaptured(payload);
                break;
            case "payment.failed":
                handlePaymentFailed(payload);
                break;
            case "refund.processed":
                handleRefundProcessed(payload);
                break;
            default:
                // Log unhandled event
                break;
        }
        
        return ResponseEntity.ok().build();
    }

    private void handlePaymentCaptured(Map<String, Object> payload) {
        // Update booking status
        // Send confirmation email
        // Update inventory
    }

    private void handlePaymentFailed(Map<String, Object> payload) {
        // Update booking status
        // Send notification
        // Release inventory if necessary
    }

    private void handleRefundProcessed(Map<String, Object> payload) {
        // Update refund status
        // Send notification
    }
}

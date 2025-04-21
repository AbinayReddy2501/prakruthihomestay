package com.prakruthi.homestay.service;

import com.prakruthi.homestay.model.Booking;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class RazorpayService {

    private final String keyId;
    private final String keySecret;
    private final RazorpayClient razorpayClient;

    public RazorpayService(
            @Value("${razorpay.key.id}") String keyId,
            @Value("${razorpay.key.secret}") String keySecret) throws RazorpayException {
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.razorpayClient = new RazorpayClient(keyId, keySecret);
    }

    public Map<String, Object> createOrder(Booking booking) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        
        // Convert amount to paise (Razorpay expects amount in smallest currency unit)
        int amountInPaise = booking.getTotalAmount().multiply(new BigDecimal("100")).intValue();
        
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "booking_" + booking.getBookingId());
        
        // Add notes for better tracking
        JSONObject notes = new JSONObject();
        notes.put("booking_id", booking.getBookingId());
        notes.put("guest_name", booking.getGuestDetails().getName());
        notes.put("check_in", booking.getCheckInDate().toString());
        notes.put("check_out", booking.getCheckOutDate().toString());
        orderRequest.put("notes", notes);

        Order order = razorpayClient.orders.create(orderRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("keyId", keyId);
        
        return response;
    }

    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) 
            throws RazorpayException {
        JSONObject attributes = new JSONObject();
        attributes.put("razorpay_order_id", orderId);
        attributes.put("razorpay_payment_id", paymentId);
        attributes.put("razorpay_signature", signature);

        try {
            razorpayClient.utility.verifyPaymentSignature(attributes);
            return true;
        } catch (RazorpayException e) {
            return false;
        }
    }

    public void processRefund(String paymentId, BigDecimal amount) throws RazorpayException {
        JSONObject refundRequest = new JSONObject();
        int refundAmount = amount.multiply(new BigDecimal("100")).intValue();
        refundRequest.put("amount", refundAmount);
        refundRequest.put("speed", "normal");

        razorpayClient.payments.refund(paymentId, refundRequest);
    }

    public Map<String, Object> fetchPaymentDetails(String paymentId) throws RazorpayException {
        com.razorpay.Payment payment = razorpayClient.payments.fetch(paymentId);
        
        Map<String, Object> paymentDetails = new HashMap<>();
        paymentDetails.put("id", payment.get("id"));
        paymentDetails.put("amount", payment.get("amount"));
        paymentDetails.put("status", payment.get("status"));
        paymentDetails.put("method", payment.get("method"));
        paymentDetails.put("email", payment.get("email"));
        paymentDetails.put("contact", payment.get("contact"));
        
        return paymentDetails;
    }
}

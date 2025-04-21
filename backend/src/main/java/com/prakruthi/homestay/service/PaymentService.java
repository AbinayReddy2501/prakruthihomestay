package com.prakruthi.homestay.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public Order createOrder(BigDecimal amount, String currency) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount.multiply(new BigDecimal(100)).intValue()); // Convert to paise
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", "order_" + System.currentTimeMillis());
        orderRequest.put("payment_capture", 1);

        return razorpay.orders.create(orderRequest);
    }

    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) 
            throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        String expectedSignature = razorpay.utility.verifyPaymentSignature(
            new JSONObject()
                .put("order_id", orderId)
                .put("payment_id", paymentId)
                .put("signature", signature)
        );
        
        return expectedSignature != null;
    }

    public void processRefund(String paymentId, BigDecimal amount) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject refundRequest = new JSONObject();
        refundRequest.put("amount", amount.multiply(new BigDecimal(100)).intValue());
        refundRequest.put("speed", "normal");

        razorpay.payments.refund(paymentId, refundRequest);
    }
}

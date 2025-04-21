package com.prakruthi.homestay.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String bookingId;
    
    @DBRef
    private User user;
    
    @DBRef
    private Room room;
    
    private GuestDetails guestDetails;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDateTime actualCheckInTime;
    private LocalDateTime actualCheckOutTime;
    
    @DBRef
    private User checkedInBy;
    
    @DBRef
    private User checkedOutBy;
    
    private BookingStatus status;
    private BigDecimal totalAmount;
    private List<DailyRate> priceBreakdown;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private PaymentStatus paymentStatus;
    private List<RefundDetails> refundDetails;
    private String cancellationReason;
    private String specialRequests;
    private String notes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    public static class GuestDetails {
        private String name;
        private String email;
        private String phone;
        private IdProof idProof;
        private int numberOfGuests;
        private String address;
    }

    @Data
    public static class IdProof {
        private String type;
        private String number;
        private String image;
    }

    @Data
    public static class DailyRate {
        private LocalDate date;
        private BigDecimal price;
    }

    @Data
    public static class RefundDetails {
        private String refundId;
        private BigDecimal amount;
        private String reason;
        private User processedBy;
        private LocalDateTime processedAt;
    }

    public enum BookingStatus {
        CONFIRMED,
        CHECKED_IN,
        CHECKED_OUT,
        CANCELLED,
        REFUNDED,
        COMPLETED
    }

    public enum PaymentStatus {
        PAID,
        REFUNDED,
        PARTIAL_REFUND
    }
}

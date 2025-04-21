package com.prakruthi.homestay.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "availability")
public class Availability {
    @Id
    private String id;
    
    @DBRef
    private Room room;
    
    private LocalDate date;
    private boolean isAvailable;
    private String reason;
    
    @DBRef(lazy = true)
    private Booking booking;
    
    @DBRef
    private User updatedBy;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum BlockReason {
        BOOKED,
        MAINTENANCE,
        ADMIN_RESTRICTED
    }
}

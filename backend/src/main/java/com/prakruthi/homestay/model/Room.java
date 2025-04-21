package com.prakruthi.homestay.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    private String name;
    private String description;
    private String roomType;
    private BigDecimal basePrice;
    private int capacity;
    private List<String> amenities;
    private List<String> images;
    private RoomStatus status;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum RoomStatus {
        ACTIVE,
        MAINTENANCE
    }
}

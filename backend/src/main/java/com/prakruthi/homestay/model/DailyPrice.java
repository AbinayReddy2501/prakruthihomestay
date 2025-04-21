package com.prakruthi.homestay.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "daily_pricing")
public class DailyPrice {
    @Id
    private String id;
    
    @DBRef
    private Room room;
    
    private LocalDate date;
    private BigDecimal price;
    private PriceReason reason;
    
    @DBRef
    private User updatedBy;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum PriceReason {
        SEASON,
        EVENT,
        SPECIAL,
        DEFAULT
    }
}

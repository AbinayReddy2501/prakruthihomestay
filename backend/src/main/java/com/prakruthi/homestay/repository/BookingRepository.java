package com.prakruthi.homestay.repository;

import com.prakruthi.homestay.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByRoomId(String roomId);
    
    @Query("{'checkInDate': {'$lte': ?1}, 'checkOutDate': {'$gte': ?0}, 'status': {'$nin': ['CANCELLED', 'REFUNDED']}}")
    List<Booking> findOverlappingBookings(LocalDate startDate, LocalDate endDate);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    @Query("{'checkInDate': {'$eq': ?0}}")
    List<Booking> findByCheckInDate(LocalDate date);
    
    @Query("{'checkOutDate': {'$eq': ?0}}")
    List<Booking> findByCheckOutDate(LocalDate date);
}

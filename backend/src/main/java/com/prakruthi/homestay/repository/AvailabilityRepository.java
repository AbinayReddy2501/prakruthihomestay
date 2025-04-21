package com.prakruthi.homestay.repository;

import com.prakruthi.homestay.model.Availability;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface AvailabilityRepository extends MongoRepository<Availability, String> {
    List<Availability> findByRoomIdAndDateBetween(String roomId, LocalDate startDate, LocalDate endDate);
    
    @Query("{'room._id': ?0, 'date': {'$gte': ?1, '$lte': ?2}, 'isAvailable': true}")
    List<Availability> findAvailableDates(String roomId, LocalDate startDate, LocalDate endDate);
    
    void deleteByRoomIdAndDateBetween(String roomId, LocalDate startDate, LocalDate endDate);
}

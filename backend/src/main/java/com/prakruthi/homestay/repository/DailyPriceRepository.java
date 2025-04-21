package com.prakruthi.homestay.repository;

import com.prakruthi.homestay.model.DailyPrice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyPriceRepository extends MongoRepository<DailyPrice, String> {
    Optional<DailyPrice> findByRoomIdAndDate(String roomId, LocalDate date);
    
    List<DailyPrice> findByRoomIdAndDateBetween(String roomId, LocalDate startDate, LocalDate endDate);
    
    @Query("{'room._id': ?0, 'date': {'$gte': ?1, '$lte': ?2}}")
    List<DailyPrice> findPricesForDateRange(String roomId, LocalDate startDate, LocalDate endDate);
    
    void deleteByRoomIdAndDateBetween(String roomId, LocalDate startDate, LocalDate endDate);
}

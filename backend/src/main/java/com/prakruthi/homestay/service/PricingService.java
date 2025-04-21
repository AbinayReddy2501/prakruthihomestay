package com.prakruthi.homestay.service;

import com.prakruthi.homestay.model.DailyPrice;
import com.prakruthi.homestay.model.Room;
import com.prakruthi.homestay.model.User;
import com.prakruthi.homestay.repository.DailyPriceRepository;
import com.prakruthi.homestay.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PricingService {

    @Autowired
    private DailyPriceRepository dailyPriceRepository;

    @Autowired
    private RoomRepository roomRepository;

    public List<DailyPrice> getPricing(String roomId, LocalDate startDate, LocalDate endDate) {
        return dailyPriceRepository.findByRoomIdAndDateBetween(roomId, startDate, endDate);
    }

    @Transactional
    public void setDailyPrice(String roomId, LocalDate date, BigDecimal price, 
                            DailyPrice.PriceReason reason, User updatedBy) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("Room not found"));

        DailyPrice dailyPrice = dailyPriceRepository.findByRoomIdAndDate(roomId, date)
            .orElse(new DailyPrice());

        dailyPrice.setRoom(room);
        dailyPrice.setDate(date);
        dailyPrice.setPrice(price);
        dailyPrice.setReason(reason);
        dailyPrice.setUpdatedBy(updatedBy);

        dailyPriceRepository.save(dailyPrice);
    }

    @Transactional
    public void setBulkPricing(String roomId, LocalDate startDate, LocalDate endDate, 
                             BigDecimal price, DailyPrice.PriceReason reason, User updatedBy) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("Room not found"));

        List<DailyPrice> priceList = new ArrayList<>();
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            DailyPrice dailyPrice = new DailyPrice();
            dailyPrice.setRoom(room);
            dailyPrice.setDate(currentDate);
            dailyPrice.setPrice(price);
            dailyPrice.setReason(reason);
            dailyPrice.setUpdatedBy(updatedBy);
            priceList.add(dailyPrice);
            currentDate = currentDate.plusDays(1);
        }

        dailyPriceRepository.deleteByRoomIdAndDateBetween(roomId, startDate, endDate);
        dailyPriceRepository.saveAll(priceList);
    }

    public BigDecimal calculateTotalPrice(String roomId, LocalDate startDate, LocalDate endDate) {
        List<DailyPrice> prices = dailyPriceRepository.findPricesForDateRange(roomId, startDate, endDate);
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("Room not found"));

        return prices.stream()
            .map(DailyPrice::getPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<DailyPrice> getSeasonalPricing(String roomId, DailyPrice.PriceReason reason) {
        return dailyPriceRepository.findAll().stream()
            .filter(price -> price.getRoom().getId().equals(roomId) && price.getReason() == reason)
            .toList();
    }
}

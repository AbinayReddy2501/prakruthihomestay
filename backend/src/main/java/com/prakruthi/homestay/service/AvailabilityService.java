package com.prakruthi.homestay.service;

import com.prakruthi.homestay.model.Availability;
import com.prakruthi.homestay.model.Room;
import com.prakruthi.homestay.model.User;
import com.prakruthi.homestay.repository.AvailabilityRepository;
import com.prakruthi.homestay.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AvailabilityService {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private RoomRepository roomRepository;

    public List<Availability> getAvailability(String roomId, LocalDate startDate, LocalDate endDate) {
        return availabilityRepository.findByRoomIdAndDateBetween(roomId, startDate, endDate);
    }

    @Transactional
    public void setAvailability(String roomId, LocalDate startDate, LocalDate endDate, 
                              boolean isAvailable, String reason, User updatedBy) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("Room not found"));

        List<Availability> availabilityList = new ArrayList<>();
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            Availability availability = new Availability();
            availability.setRoom(room);
            availability.setDate(currentDate);
            availability.setAvailable(isAvailable);
            availability.setReason(reason);
            availability.setUpdatedBy(updatedBy);
            availabilityList.add(availability);
            currentDate = currentDate.plusDays(1);
        }

        availabilityRepository.deleteByRoomIdAndDateBetween(roomId, startDate, endDate);
        availabilityRepository.saveAll(availabilityList);
    }

    public boolean isRoomAvailable(String roomId, LocalDate startDate, LocalDate endDate) {
        List<Availability> availabilities = availabilityRepository.findAvailableDates(roomId, startDate, endDate);
        long daysInRange = startDate.until(endDate).getDays() + 1;
        return availabilities.size() == daysInRange;
    }

    @Transactional
    public void blockDatesForBooking(String roomId, LocalDate startDate, LocalDate endDate) {
        setAvailability(roomId, startDate, endDate, false, Availability.BlockReason.BOOKED.name(), null);
    }

    @Transactional
    public void releaseDatesFromBooking(String roomId, LocalDate startDate, LocalDate endDate) {
        setAvailability(roomId, startDate, endDate, true, null, null);
    }
}

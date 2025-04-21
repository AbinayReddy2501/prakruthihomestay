package com.prakruthi.homestay.config;

import com.prakruthi.homestay.model.Room;
import com.prakruthi.homestay.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@Order(2) // Run after DatabaseInitializer
public class DefaultRoomConfig implements CommandLineRunner {

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public void run(String... args) {
        if (roomRepository.count() == 0) {
            Room villa = new Room();
            villa.setName("Luxury 2BHK Villa");
            villa.setDescription("Spacious 2BHK villa with modern amenities, perfect for families. " +
                    "Features include a fully equipped kitchen, living room, dining area, and private balcony " +
                    "with garden views. Experience comfort and luxury in our peaceful surroundings.");
            villa.setRoomType("2BHK_VILLA");
            villa.setBasePrice(new BigDecimal("5000")); // ₹5000 per night
            villa.setCapacity(6); // Maximum 6 guests
            villa.setAmenities(Arrays.asList(
                "2 Bedrooms with King Size Beds",
                "2 Bathrooms with Modern Fixtures",
                "Fully Equipped Kitchen",
                "Living Room with Smart TV",
                "Dining Area",
                "Private Balcony",
                "Air Conditioning",
                "Free Wi-Fi",
                "Daily Housekeeping",
                "24/7 Security",
                "Parking Space",
                "Garden View"
            ));
            villa.setImages(Arrays.asList(
                "/images/villa/exterior.jpg",
                "/images/villa/living-room.jpg",
                "/images/villa/bedroom-1.jpg",
                "/images/villa/bedroom-2.jpg",
                "/images/villa/kitchen.jpg",
                "/images/villa/balcony.jpg"
            ));
            villa.setStatus(Room.RoomStatus.ACTIVE);
            villa.setCreatedAt(LocalDateTime.now());
            villa.setUpdatedAt(LocalDateTime.now());

            roomRepository.save(villa);
            System.out.println("Default 2BHK Villa configuration created successfully!");
        }
    }
}

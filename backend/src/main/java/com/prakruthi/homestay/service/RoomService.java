package com.prakruthi.homestay.service;

import com.prakruthi.homestay.model.Room;
import com.prakruthi.homestay.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private AvailabilityService availabilityService;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getActiveRooms() {
        return roomRepository.findByStatus(Room.RoomStatus.ACTIVE);
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    @Transactional
    public Room createRoom(Room room) {
        room.setStatus(Room.RoomStatus.ACTIVE);
        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(String id, Room roomDetails) {
        Room room = getRoomById(id);
        
        room.setName(roomDetails.getName());
        room.setDescription(roomDetails.getDescription());
        room.setRoomType(roomDetails.getRoomType());
        room.setBasePrice(roomDetails.getBasePrice());
        room.setCapacity(roomDetails.getCapacity());
        room.setAmenities(roomDetails.getAmenities());
        room.setImages(roomDetails.getImages());
        room.setStatus(roomDetails.getStatus());
        
        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(String id) {
        Room room = getRoomById(id);
        room.setStatus(Room.RoomStatus.MAINTENANCE);
        roomRepository.save(room);
    }

    public List<Room> getRoomsByType(String roomType) {
        return roomRepository.findByRoomType(roomType);
    }

    public Page<Room> getRoomsWithPagination(Pageable pageable) {
        return roomRepository.findAll(pageable);
    }
}

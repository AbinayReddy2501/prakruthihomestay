package com.prakruthi.homestay.repository;

import com.prakruthi.homestay.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findByStatus(Room.RoomStatus status);
    List<Room> findByRoomType(String roomType);
}

package com.prakruthi.homestay.repository;

import com.prakruthi.homestay.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByRoleIn(List<String> roles);
    List<User> findByRole(String role);
    long countByRole(String role);
}

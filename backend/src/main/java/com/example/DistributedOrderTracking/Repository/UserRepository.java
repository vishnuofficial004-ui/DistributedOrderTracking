package com.example.DistributedOrderTracking.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DistributedOrderTracking.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    User findByEmail(String email);

    // Check if email exists
    boolean existsByEmail(String email);

    // Search users by name (case insensitive)
    List<User> findByNameContainingIgnoreCase(String name);

    // Find users by role
    List<User> findByRole(String role);

    // Count users by role
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") String role);
}
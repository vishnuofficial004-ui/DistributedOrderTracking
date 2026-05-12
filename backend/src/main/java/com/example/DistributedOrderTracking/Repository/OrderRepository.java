package com.example.DistributedOrderTracking.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DistributedOrderTracking.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Sort orders newest first
    List<Order> findAllByOrderByOrderDateDesc();

    // Get all orders by a specific user
    List<Order> findByUserId(Long userId);

    // Get orders by status
    @Query("SELECT o FROM Order o WHERE o.orderStatus.status = :status")
    List<Order> findByStatus(@Param("status") String status);

    // Get orders between two dates
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :start AND :end ORDER BY o.orderDate DESC")
    List<Order> findByDateRange(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    // Get orders above a certain price
    @Query("SELECT o FROM Order o WHERE o.totalPrice >= :minPrice ORDER BY o.totalPrice DESC")
    List<Order> findByMinPrice(@Param("minPrice") Double minPrice);

    // Count orders per user
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    // Get total revenue
    @Query("SELECT SUM(o.totalPrice) FROM Order o")
    Double getTotalRevenue();
}
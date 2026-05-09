package com.example.DistributedOrderTracking.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DistributedOrderTracking.model.OrderStatus;

@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {
    OrderStatus findByOrderId(Long orderId);
}
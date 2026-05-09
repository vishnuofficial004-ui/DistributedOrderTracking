package com.example.DistributedOrderTracking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.DistributedOrderTracking.Repository.OrderRepository;
import com.example.DistributedOrderTracking.exception.ResourceNotFoundException;
import com.example.DistributedOrderTracking.model.Order;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders(int page, int size, String sortBy) {
        try {
            return orderRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy))
            ).getContent();
        } catch (Exception e) {
            return orderRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
            ).getContent();
        }
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + id));
    }

    @Transactional
    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }
}
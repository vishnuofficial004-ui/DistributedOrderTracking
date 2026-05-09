package com.example.DistributedOrderTracking.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.DistributedOrderTracking.Repository.OrderRepository;
import com.example.DistributedOrderTracking.Repository.ProductRepository;
import com.example.DistributedOrderTracking.Repository.UserRepository;
import com.example.DistributedOrderTracking.exception.ResourceNotFoundException;
import com.example.DistributedOrderTracking.model.Order;
import com.example.DistributedOrderTracking.model.OrderStatus;
import com.example.DistributedOrderTracking.model.Product;
import com.example.DistributedOrderTracking.model.User;
import com.example.DistributedOrderTracking.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderService orderService;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size, sortBy));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + id));
        return ResponseEntity.ok(order);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        List<Integer> productIdInts = (List<Integer>) request.get("productIds");
        List<Long> productIds = productIdInts.stream()
                .map(Long::valueOf).collect(Collectors.toList());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));

        List<Product> products = productIds.stream()
                .map(pid -> productRepository.findById(pid)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + pid)))
                .collect(Collectors.toList());

        double totalPrice = products.stream()
                .mapToDouble(Product::getPrice).sum();

        Order order = new Order();
        order.setUser(user);
        order.setProducts(products);
        order.setTotalPrice(totalPrice);
        order.setOrderDate(LocalDateTime.now());

        OrderStatus status = new OrderStatus();
        status.setStatus("PENDING");
        status.setUpdatedAt(LocalDateTime.now());
        status.setOrder(order);
        order.setOrderStatus(status);

        Order saved = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + id));

        String newStatus = request.get("status");

        if (order.getOrderStatus() == null) {
            OrderStatus status = new OrderStatus();
            status.setStatus(newStatus);
            status.setUpdatedAt(LocalDateTime.now());
            status.setOrder(order);
            order.setOrderStatus(status);
        } else {
            order.getOrderStatus().setStatus(newStatus);
            order.getOrderStatus().setUpdatedAt(LocalDateTime.now());
        }

        return ResponseEntity.ok(orderRepository.save(order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Order deleted successfully"));
    }
}
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
import com.example.DistributedOrderTracking.dto.OrderRequest;
import com.example.DistributedOrderTracking.dto.OrderResponse;
import com.example.DistributedOrderTracking.dto.OrderStatusUpdateRequest;
import com.example.DistributedOrderTracking.exception.ResourceNotFoundException;
import com.example.DistributedOrderTracking.model.Order;
import com.example.DistributedOrderTracking.model.OrderStatus;
import com.example.DistributedOrderTracking.model.Product;
import com.example.DistributedOrderTracking.model.User;
import com.example.DistributedOrderTracking.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderService orderService;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;


    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        List<Order> orders = orderService.getAllOrders(page, size, sortBy);
        List<OrderResponse> response = orders.stream()
                .map(OrderResponse::fromOrder)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + id));
        return ResponseEntity.ok(OrderResponse.fromOrder(order));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + request.getUserId()));

        List<Product> products = request.getProductIds().stream()
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
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(OrderResponse.fromOrder(saved));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + id));

        if (order.getOrderStatus() == null) {
            OrderStatus status = new OrderStatus();
            status.setStatus(request.getStatus());
            status.setUpdatedAt(LocalDateTime.now());
            status.setOrder(order);
            order.setOrderStatus(status);
        } else {
            order.getOrderStatus().setStatus(request.getStatus());
            order.getOrderStatus().setUpdatedAt(LocalDateTime.now());
        }

        return ResponseEntity.ok(OrderResponse.fromOrder(orderRepository.save(order)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Order deleted successfully"));
    }

    // Add these methods inside OrderController.java
// after the existing deleteOrder method

@GetMapping("/user/{userId}")
public ResponseEntity<List<OrderResponse>> getOrdersByUser(
        @PathVariable Long userId) {
    List<Order> orders = orderService.getOrdersByUser(userId);
    List<OrderResponse> response = orders.stream()
            .map(OrderResponse::fromOrder)
            .collect(Collectors.toList());
    return ResponseEntity.ok(response);
}

@GetMapping("/status/{status}")
public ResponseEntity<List<OrderResponse>> getOrdersByStatus(
        @PathVariable String status) {
    List<Order> orders = orderService.getOrdersByStatus(status);
    List<OrderResponse> response = orders.stream()
            .map(OrderResponse::fromOrder)
            .collect(Collectors.toList());
    return ResponseEntity.ok(response);
}

@GetMapping("/revenue")
public ResponseEntity<Map<String, Double>> getTotalRevenue() {
    return ResponseEntity.ok(
        Map.of("totalRevenue", orderService.getTotalRevenue())
    );
}
}
package com.example.DistributedOrderTracking.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.DistributedOrderTracking.model.Order;

public class OrderResponse {

    private Long id;
    private UserResponse user;
    private Double totalPrice;
    private LocalDateTime orderDate;
    private String status;
    private List<ProductResponse> products;

    public OrderResponse() {}

    public static OrderResponse fromOrder(Order order) {
        OrderResponse resp = new OrderResponse();
        resp.setId(order.getId());

        if (order.getUser() != null) {
            resp.setUser(UserResponse.fromUser(order.getUser()));
        }

        resp.setTotalPrice(order.getTotalPrice());
        resp.setOrderDate(order.getOrderDate());

        if (order.getOrderStatus() != null) {
            resp.setStatus(order.getOrderStatus().getStatus());
        }

        if (order.getProducts() != null) {
            resp.setProducts(
                order.getProducts().stream()
                    .map(ProductResponse::fromProduct)
                    .collect(Collectors.toList())
            );
        }

        return resp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<ProductResponse> getProducts() { return products; }
    public void setProducts(List<ProductResponse> products) { this.products = products; }
}
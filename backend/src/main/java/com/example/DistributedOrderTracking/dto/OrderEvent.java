package com.example.DistributedOrderTracking.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

public class OrderEvent implements Serializable {

    private Long orderId;
    private String eventType;   // ORDER_CREATED or ORDER_STATUS_UPDATED
    private String status;
    private Double totalPrice;
    private String customerName;
    private LocalDateTime timestamp;

    public OrderEvent() {}

    public OrderEvent(Long orderId, String eventType, String status,
                      Double totalPrice, String customerName) {
        this.orderId = orderId;
        this.eventType = eventType;
        this.status = status;
        this.totalPrice = totalPrice;
        this.customerName = customerName;
        this.timestamp = LocalDateTime.now();
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
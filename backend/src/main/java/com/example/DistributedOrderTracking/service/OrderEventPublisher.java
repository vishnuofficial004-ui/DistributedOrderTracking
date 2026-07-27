package com.example.DistributedOrderTracking.service;

import com.example.DistributedOrderTracking.dto.OrderEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OrderEventPublisher {

    private static final Logger logger =
            LoggerFactory.getLogger(OrderEventPublisher.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key}")
    private String routingKey;

    public void publishOrderCreated(Long orderId, String status,
                                    Double totalPrice, String customerName) {
        OrderEvent event = new OrderEvent(
                orderId, "ORDER_CREATED", status, totalPrice, customerName
        );
        rabbitTemplate.convertAndSend(exchange, routingKey, event);
        logger.info("Published ORDER_CREATED event for orderId: {}", orderId);
    }

    public void publishOrderStatusUpdated(Long orderId, String status,
                                          Double totalPrice, String customerName) {
        OrderEvent event = new OrderEvent(
                orderId, "ORDER_STATUS_UPDATED", status, totalPrice, customerName
        );
        rabbitTemplate.convertAndSend(exchange, routingKey, event);
        logger.info("Published ORDER_STATUS_UPDATED event for orderId: {}", orderId);
    }
}
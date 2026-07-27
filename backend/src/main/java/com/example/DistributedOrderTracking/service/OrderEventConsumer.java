package com.example.DistributedOrderTracking.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.example.DistributedOrderTracking.dto.OrderEvent;

@Service
public class OrderEventConsumer {

    private static final Logger logger =
            LoggerFactory.getLogger(OrderEventConsumer.class);

    @RabbitListener(queues = "${rabbitmq.queue.order}")
    public void consumeOrderEvent(OrderEvent event) {
        logger.info("------------------------------------------");
        logger.info("Received Order Event");
        logger.info("Event Type  : {}", event.getEventType());
        logger.info("Order ID    : {}", event.getOrderId());
        logger.info("Status      : {}", event.getStatus());
        logger.info("Customer    : {}", event.getCustomerName());
        logger.info("Total Price : {}", event.getTotalPrice());
        logger.info("Timestamp   : {}", event.getTimestamp());
        logger.info("------------------------------------------");

        // In future: send email, update analytics, notify frontend via WebSocket
        handleEvent(event);
    }

    private void handleEvent(OrderEvent event) {
        switch(event.getEventType()) {
            case "ORDER_CREATED":
                logger.info("Processing new order #{}", event.getOrderId());
                break;
            case "ORDER_STATUS_UPDATED":
                logger.info("Order #{} status changed to {}",
                        event.getOrderId(), event.getStatus());
                break;
            default:
                logger.warn("Unknown event type: {}", event.getEventType());
        }
    }
}
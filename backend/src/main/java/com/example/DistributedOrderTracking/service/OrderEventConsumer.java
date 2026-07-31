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

        handleEvent(event);
    }

    private void handleEvent(OrderEvent event) {
        if (event.getEventType() == null) {
            logger.warn("Event type is null for order #{}", event.getOrderId());
            return;
        }

        if("ORDER_CREATED".equals(event.getEventType())) {
            logger.info("Processing new order #{}", event.getOrderId());

        } else if ("ORDER_STATUS_UPDATED".equals(event.getEventType())) {
            logger.info("Order #{} status changed to {}",
                    event.getOrderId(), event.getStatus());

        } else {
            logger.warn("Unknown event type: {}", event.getEventType());
        }
    }
}
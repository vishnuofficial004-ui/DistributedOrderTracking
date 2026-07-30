package com.example.DistributedOrderTracking.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.queue.order}")
    private String orderQueue;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key}")
    private String routingKey;

    // Create the queue
    @Bean
    public Queue orderQueue() {
        return new Queue(orderQueue, true);
    }

    // Create the exchange
    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(exchange);
    }

    // Bind queue to exchange with routing key
    @Bean
    public Binding binding(Queue orderQueue, DirectExchange exchange) {
        return BindingBuilder
                .bind(orderQueue)
                .to(exchange)
                .with(routingKey);
    }

    // Convert messages to JSON
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // Use JSON converter in RabbitTemplate
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
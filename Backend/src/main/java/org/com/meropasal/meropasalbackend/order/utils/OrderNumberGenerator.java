package org.com.meropasal.meropasalbackend.order.utils;

import lombok.Getter;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.order.repo.OrderRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

/**
 * Created On : 2025 28 Jul 10:01 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
@Component
public class OrderNumberGenerator {

    private final OrderRepository orderRepository;

    public OrderNumberGenerator(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    private String generateOrderNumber() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder("#");
        for (int i = 0; i < 8; i++) {
            int index = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString();
    }

    public String generateUniqueOrderNumber() {
        String orderNumber;
        do {
            orderNumber = generateOrderNumber();
        } while (orderRepository.existsByOrderNumber(orderNumber));
        return orderNumber;
    }
}

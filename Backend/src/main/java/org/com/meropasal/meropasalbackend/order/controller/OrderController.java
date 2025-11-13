package org.com.meropasal.meropasalbackend.order.controller;

import org.com.meropasal.meropasalbackend.authSystem.config.CustomerJwtService;
import org.com.meropasal.meropasalbackend.order.dto.OrderRequestDTO;
import org.com.meropasal.meropasalbackend.order.dto.OrderResponseDTO;
import org.com.meropasal.meropasalbackend.order.enums.OrderStatus;
import org.com.meropasal.meropasalbackend.order.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 22 Jul 5:15 PM
 * Author : Monu Siddiki
 * Description : Handles order-related customer APIs
 **/
@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final CustomerJwtService customerJwtService;

    public OrderController(OrderService orderService, CustomerJwtService customerJwtService) {
        this.orderService = orderService;
        this.customerJwtService = customerJwtService;
    }

    // Helper method
    private UUID extractCustomerIdFromAuthHeader(String authHeader) {
        String token = authHeader.substring(7);
        return UUID.fromString(customerJwtService.extractCustomerId(token));
    }

    // 1. Create order
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequestDTO orderRequest,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            OrderResponseDTO responseDTO = orderService.createOrderFromCart(orderRequest, customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Order created successfully",
                    "order", responseDTO
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    // 2. Get all orders of the customer
    //this is for the testing
    @GetMapping
    public ResponseEntity<?> getCustomerOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            List<OrderResponseDTO> orders = orderService.getOrdersByCustomer(customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "orders", orders
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    // 3. Get order details by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(
            @PathVariable UUID orderId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            OrderResponseDTO order = orderService.getOrderByIdAndCustomer(orderId, customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "order", order
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    // 4. Cancel order
    @PatchMapping("/cancel/{orderId}")
    public ResponseEntity<?> cancelOrder(
            @PathVariable UUID orderId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            orderService.cancelOrder(orderId, customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Order cancelled successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestParam OrderStatus status) {
        try{
        OrderResponseDTO updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "orders", updatedOrder
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }


}

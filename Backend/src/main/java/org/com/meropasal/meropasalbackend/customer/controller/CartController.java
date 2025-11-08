package org.com.meropasal.meropasalbackend.customer.controller;

import org.com.meropasal.meropasalbackend.authSystem.config.CustomerJwtService;
import org.com.meropasal.meropasalbackend.customer.dto.CartItemDTO;
import org.com.meropasal.meropasalbackend.customer.dto.CartSummaryDTO;
import org.com.meropasal.meropasalbackend.customer.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 20 Jul 10:56 PM
 * Author : Monu Siddiki
 * Description :
 **/

@RestController
@RequestMapping("/cart")
public class CartController {


    private final CartService cartService;
    private final CustomerJwtService customerJwtService;

    public CartController(CartService cartService, CustomerJwtService customerJwtService) {
        this.cartService = cartService;
        this.customerJwtService = customerJwtService;
    }

    //helper class for extracting the customerId from the jwt
    private UUID extractCustomerIdFromAuthHeader(String authHeader) {
        String token = authHeader.substring(7);
        return UUID.fromString(customerJwtService.extractCustomerId(token));
    }


    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            UUID productId = UUID.fromString((String) request.get("productId"));
            Integer quantity = (Integer) request.getOrDefault("quantity", 1);
            String selectedVariant = (String) request.get("selectedVariant");

            CartItemDTO cartItem = cartService.addToCart(customerId, productId, quantity, selectedVariant);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Product added to cart successfully",
                    "cartItem", cartItem
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getCartItems(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            List<CartItemDTO> cartItems = cartService.getCartItems(customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "cartItems", cartItems
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/grouped")
    public ResponseEntity<?> getCartItemsGroupedByShop(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            Map<UUID, List<CartItemDTO>> groupedItems = cartService.getCartItemsGroupedByShop(customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "cartItemsByShop", groupedItems
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateCartItem(
            @PathVariable UUID cartItemId,
            @RequestBody Map<String, Integer> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            Integer quantity = request.get("quantity");

            CartItemDTO updatedItem = cartService.updateCartItem(customerId, cartItemId, quantity);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Cart item updated successfully",
                    "cartItem", updatedItem
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable UUID cartItemId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            cartService.removeFromCart(customerId, cartItemId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Item removed from cart successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            cartService.clearCart(customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Cart cleared successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getCartSummary(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            CartSummaryDTO summary = cartService.getCartSummary(customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "summary", summary
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCartItemsCount(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            long count = cartService.getCartItemsCount(customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "count", count
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }
}

package org.com.meropasal.meropasalbackend.customer.controller;

import org.com.meropasal.meropasalbackend.authSystem.config.CustomerJwtService;
import org.com.meropasal.meropasalbackend.customer.dto.WishlistItemDTO;
import org.com.meropasal.meropasalbackend.customer.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 21 Jul 12:34 PM
 * Author : Monu Siddiki
 * Description :
 **/

@RestController
@RequestMapping("/wishlist")
public class WishlistController {


    private final WishlistService wishlistService;
    private final CustomerJwtService customerJwtService;

    public WishlistController(WishlistService wishlistService, CustomerJwtService customerJwtService) {
        this.wishlistService = wishlistService;
        this.customerJwtService = customerJwtService;
    }

    // Helper method for extracting the customerId from the jwt
    private UUID extractCustomerIdFromAuthHeader(String authHeader) {
        String token = authHeader.substring(7);
        return UUID.fromString(customerJwtService.extractCustomerId(token));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToWishlist(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            UUID productId = UUID.fromString((String) request.get("productId"));

            WishlistItemDTO wishlistItem = wishlistService.addToWishlist(customerId, productId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Product added to wishlist successfully",
                    "wishlistItem", wishlistItem
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getWishlistItems(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            List<WishlistItemDTO> wishlistItems = wishlistService.getWishlistItems(customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "wishlistItems", wishlistItems
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable UUID productId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            wishlistService.removeFromWishlist(customerId, productId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Item removed from wishlist successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearWishlist(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            wishlistService.clearWishlist(customerId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Wishlist cleared successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<?> checkWishlistStatus(
            @PathVariable UUID productId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            boolean isInWishlist = wishlistService.isInWishlist(customerId, productId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "isInWishlist", isInWishlist
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getWishlistItemsCount(@RequestHeader("Authorization") String authHeader) {
        try {
            UUID customerId = extractCustomerIdFromAuthHeader(authHeader);
            long count = wishlistService.getWishlistItemsCount(customerId);

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

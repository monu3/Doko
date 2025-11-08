package org.com.meropasal.meropasalbackend.shop.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.com.meropasal.meropasalbackend.address.dto.AddressDto;
import org.com.meropasal.meropasalbackend.customer.dto.AudienceDTO;
import org.com.meropasal.meropasalbackend.customer.service.AudienceService;
import org.com.meropasal.meropasalbackend.order.dto.OrderResponseDTO;
import org.com.meropasal.meropasalbackend.order.service.OrderService;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.shop.dto.ShopDTO;
import org.com.meropasal.meropasalbackend.shop.dto.ShopThemeDTO;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.com.meropasal.meropasalbackend.shop.service.ShopService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 09 Feb 12:56 PM
 * Author : Monu Siddiki
 * Description :
 **/
@RestController
@RequestMapping("/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;
    private final OrderService orderService;
    private final AudienceService audienceService;


    @PostMapping
    public ResponseEntity<Shop> createShop(@Valid @RequestBody ShopDTO shopDTO, @RequestParam UUID ownerId) {
        Shop shop = shopService.createShop(shopDTO, ownerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(shop);
    }

    // Get a single shop by ownerId
    @PreAuthorize("hasAnyRole('SHOP_OWNER')") // SHOP_OWNER and ADMIN can access this endpoint
    @GetMapping(params = "ownerId")
    public ResponseEntity<Shop> getShopByOwnerId(@RequestParam UUID ownerId) {
        Shop shop = shopService.getShopByOwnerId(ownerId);
        return ResponseEntity.ok(shop);
    }

    // Get all shops
    @GetMapping
    public ResponseEntity<List<Shop>> getAllShops() {
        List<Shop> shops = shopService.getAllShops();
        return ResponseEntity.ok(shops);
    }


    //for the theme selection process
    @GetMapping("/by-url/{shopUrl}")
    public ResponseEntity<Shop> getShopByUrl(@PathVariable String shopUrl) {
        return ResponseEntity.ok(shopService.getShopByUrl(shopUrl));
    }

    // Get all active shops for gallery view
    @GetMapping("/gallery")
    public ResponseEntity<List<ShopThemeDTO>> getShopGallery() {
        List<ShopThemeDTO> shops = shopService.getAllActiveShopsForGallery();
        return ResponseEntity.ok(shops);
    }

    @PatchMapping("/{shopId}/theme")
    public ResponseEntity<Shop> updateShopTheme(
            @PathVariable UUID shopId,
            @RequestBody Map<String, String> themeUpdate
    ) {
        return ResponseEntity.ok(shopService.updateTheme(shopId, themeUpdate.get("theme")));
    }

    // Partial update for any shop fields
    @PatchMapping("/{shopId}")
    public ResponseEntity<Shop> updateShop(
            @PathVariable UUID shopId,
            @RequestBody ShopDTO shopDTO) {
        Shop updatedShop = shopService.updateShop(shopId, shopDTO);
        return ResponseEntity.ok(updatedShop);
    }

    // Update just the address
    @PatchMapping("/{shopId}/address")
    public ResponseEntity<Shop> updateShopAddress(
            @PathVariable UUID shopId,
            @Valid @RequestBody AddressDto addressDto) {
        ShopDTO shopDTO = new ShopDTO();
        shopDTO.setAddress(addressDto);
        Shop updatedShop = shopService.updateShop(shopId, shopDTO);
        return ResponseEntity.ok(updatedShop);
    }

    @GetMapping("/orders/{shopId}")
    public ResponseEntity<?> getOrdersByShop(
            @PathVariable UUID shopId) {
        try{
            // Add shop validation/authorization
            List<OrderResponseDTO> orders = orderService.getOrdersByShop(shopId);
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

    @GetMapping("/{shopId}/audience")
    public ResponseEntity<List<AudienceDTO>> getAudience(@PathVariable UUID shopId) {
        List<AudienceDTO> audience = audienceService.getAudienceByShop(shopId);
        return ResponseEntity.ok(audience);
    }


    @GetMapping("/{shopId}/payment-methods")
    public ResponseEntity<?> getShopPaymentMethods(@PathVariable UUID shopId) {
        try {
            List<PaymentMethod> paymentMethods = shopService.getActivePaymentMethods(shopId);
            return ResponseEntity.ok(
                    Map.of(
                            "status", "success",
                            "paymentMethods", paymentMethods
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "status", "error",
                            "message", "Failed to fetch payment methods: " + e.getMessage()
                    )
            );
        }
    }

}

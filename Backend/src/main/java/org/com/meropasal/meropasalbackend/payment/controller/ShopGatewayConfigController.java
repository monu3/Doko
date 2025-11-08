package org.com.meropasal.meropasalbackend.payment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.com.meropasal.meropasalbackend.payment.dto.*;
import org.com.meropasal.meropasalbackend.payment.entity.ShopGatewayConfig;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.repo.ShopGatewayConfigRepository;
import org.com.meropasal.meropasalbackend.payment.utils.CredentialsEncryptor;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.com.meropasal.meropasalbackend.shop.repo.ShopRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/shop-gateway-config")
@RequiredArgsConstructor
public class ShopGatewayConfigController {

    private final ShopGatewayConfigRepository configRepository;
    private final ShopRepository shopRepository;
    private final ObjectMapper objectMapper;
    private final CredentialsEncryptor credentialsEncryptor;

    @PostMapping
    public ResponseEntity<ApiResponse<ShopGatewayConfigResponse>> createConfig(@Valid @RequestBody CreateConfigRequest request) {
        try {
            // Find the shop entity
            Shop shop = shopRepository.findById(request.shopId())
                    .orElseThrow(() -> new RuntimeException("Shop not found with id: " + request.shopId()));

            // Check for existing config
            if (configRepository.existsByShopIdAndPaymentMethod(request.shopId(), request.paymentMethod())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Configuration already exists for this payment method"));
            }

            // Use the helper method from the request DTO
            PaymentCredentials credentials = request.getPaymentCredentials();

            ShopGatewayConfig config = new ShopGatewayConfig();
            config.setShop(shop);
            config.setPaymentMethod(request.paymentMethod());
            config.setCredentials(credentials, credentialsEncryptor, objectMapper);
            config.setActive(true);

            configRepository.save(config);
            var response = ShopGatewayConfigResponse.fromEntity(config, credentialsEncryptor);
            return ResponseEntity.ok(ApiResponse.success("Configuration created successfully", response));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error creating configuration: " + e.getMessage()));
        }
    }

    @GetMapping("/{shopId}")
    public ResponseEntity<ApiResponse<List<ShopGatewayConfigResponse>>> getConfigsByShop(
            @PathVariable UUID shopId) {
        try {
            List<ShopGatewayConfig> configs = configRepository.findByShopId(shopId);
            List<ShopGatewayConfigResponse> response = configs.stream()
                    .map(config -> ShopGatewayConfigResponse.fromEntity(config, credentialsEncryptor))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error fetching configurations: " + e.getMessage()));
        }
    }

    // Additional endpoints for better management

    @GetMapping("/{shopId}/{paymentMethod}")
    @Transactional // This method needs read-write transaction for LOB access
    public ResponseEntity<ApiResponse<ShopGatewayConfigDetailResponse>> getConfigDetail(
            @PathVariable UUID shopId,
            @PathVariable PaymentMethod paymentMethod) {
        try {
            var config = configRepository.findByShopIdAndPaymentMethod(shopId, paymentMethod)
                    .orElseThrow(() -> new RuntimeException("Configuration not found"));

            var response = ShopGatewayConfigDetailResponse.fromEntity(config, credentialsEncryptor, objectMapper);
            return ResponseEntity.ok(ApiResponse.success(response));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Configuration not found: " + e.getMessage()));
        }
    }

    @PutMapping("/{configId}")
    public ResponseEntity<ApiResponse<ShopGatewayConfigResponse>> updateConfig(
            @PathVariable UUID configId,
            @Valid @RequestBody UpdateConfigRequest request) {
        try {
            var config = configRepository.findById(configId)
                    .orElseThrow(() -> new RuntimeException("Configuration not found"));

            if (request.credentials() != null) {
                // Convert Map to PaymentCredentials using the existing payment method
                PaymentCredentials credentials = request.getPaymentCredentials(config.getPaymentMethod());
                config.setCredentials(credentials, credentialsEncryptor, objectMapper);
            }
            if (request.active() != null) {
                config.setActive(request.active());
            }

            configRepository.save(config);

            var response = ShopGatewayConfigResponse.fromEntity(config, credentialsEncryptor);
            return ResponseEntity.ok(ApiResponse.success("Configuration updated successfully", response));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error updating configuration: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{configId}")
    public ResponseEntity<ApiResponse<String>> deleteConfig(@PathVariable UUID configId) {
        try {
            if (!configRepository.existsById(configId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Configuration not found"));
            }

            configRepository.deleteById(configId);
            return ResponseEntity.ok(ApiResponse.success("Configuration deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error deleting configuration: " + e.getMessage()));
        }
    }

    @PatchMapping("/{configId}/toggle-active")
    public ResponseEntity<ApiResponse<Boolean>> toggleActive(@PathVariable UUID configId) {
        try {
            var config = configRepository.findById(configId)
                    .orElseThrow(() -> new RuntimeException("Configuration not found"));

            config.setActive(!config.isActive());
            configRepository.save(config);

            return ResponseEntity.ok(ApiResponse.success("update the status successfully", config.isActive()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error toggling configuration: " + e.getMessage()));
        }
    }

    // Admin-only endpoint to view decrypted credentials
    @GetMapping("/{configId}/credentials")
    public ResponseEntity<ApiResponse<PaymentCredentials>> getCredentialsForAdmin(
            @PathVariable UUID configId) {
        try {
            var config = configRepository.findById(configId)
                    .orElseThrow(() -> new RuntimeException("Configuration not found"));

            var credentials = config.getCredentials(credentialsEncryptor, objectMapper);
            return ResponseEntity.ok(ApiResponse.success(credentials));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error retrieving credentials: " + e.getMessage()));
        }
    }
}




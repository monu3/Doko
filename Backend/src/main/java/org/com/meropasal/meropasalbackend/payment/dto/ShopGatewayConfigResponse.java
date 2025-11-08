package org.com.meropasal.meropasalbackend.payment.dto;

import org.com.meropasal.meropasalbackend.payment.entity.ShopGatewayConfig;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.utils.CredentialsEncryptor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Created On : 2025 26 Sep 6:55 PM
 * Author : Monu Siddiki
 * Description :
 **/
// Secure Response DTOs (never expose full credentials)
public record ShopGatewayConfigResponse(
        UUID id,
        UUID shopId,
        PaymentMethod paymentMethod,
        boolean active,
        LocalDateTime createdAt,
        CredentialsMask maskedCredentials
) {
    public static ShopGatewayConfigResponse fromEntity(ShopGatewayConfig config, CredentialsEncryptor encryptor) {
        return new ShopGatewayConfigResponse(
                config.getId(),
                config.getShop().getId(),
                config.getPaymentMethod(),
                config.isActive(),
                config.getCreatedAt(),
                CredentialsMask.fromCredentials(config.getPaymentMethod(), config.getEncryptedCredentials(), encryptor)
        );
    }
}

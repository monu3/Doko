package org.com.meropasal.meropasalbackend.payment.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.com.meropasal.meropasalbackend.payment.entity.ShopGatewayConfig;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.utils.CredentialsEncryptor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 26 Sep 6:57 PM
 * Author : Monu Siddiki
 * Description :
 **/
public record ShopGatewayConfigDetailResponse(
        UUID id,
        UUID shopId,
        PaymentMethod paymentMethod,
        PaymentCredentials credentials, // Full credentials for authorized use
        boolean active,
        LocalDateTime createdAt
) {
    public static ShopGatewayConfigDetailResponse fromEntity(ShopGatewayConfig config, CredentialsEncryptor encryptor, ObjectMapper mapper) {
        return new ShopGatewayConfigDetailResponse(
                config.getId(),
                config.getShop().getId(),
                config.getPaymentMethod(),
                config.getCredentials(encryptor, mapper),
                config.isActive(),
                config.getCreatedAt()
        );
    }
}

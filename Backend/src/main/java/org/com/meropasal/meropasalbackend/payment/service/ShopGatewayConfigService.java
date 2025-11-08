package org.com.meropasal.meropasalbackend.payment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.com.meropasal.meropasalbackend.payment.dto.PaymentCredentials;
import org.com.meropasal.meropasalbackend.payment.dto.ShopGatewaySecrets;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.repo.ShopGatewayConfigRepository;
import org.com.meropasal.meropasalbackend.payment.utils.CredentialsEncryptor;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Created On : 2025 05 Sep 11:40 AM
 * Author : Monu Siddiki
 * Description :
 **/
@Service
@RequiredArgsConstructor
public class ShopGatewayConfigService {
    private final ShopGatewayConfigRepository repo;
    private final ObjectMapper mapper;
    private final CredentialsEncryptor credentialsEncryptor;

    public ShopGatewaySecrets load(UUID shopId, PaymentMethod type) {
        var config = repo.findByShopIdAndPaymentMethod(shopId, type)
                .orElseThrow(() -> new RuntimeException("Config not found"));
        try {
            PaymentCredentials credentials = config.getCredentials(credentialsEncryptor, mapper);
            return ShopGatewaySecrets.fromPaymentCredentials(credentials, type);

        } catch (Exception e) {
            throw new RuntimeException("Failed to load credentials", e);
        }
    }
}


package org.com.meropasal.meropasalbackend.payment.service;

import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.repo.PaymentGateway;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created On : 2025 05 Sep 11:29 AM
 * Author : Monu Siddiki
 * Description :
 **/
@Service
public class GatewayRegistry {

    private final Map<PaymentMethod, PaymentGateway> map;

    public GatewayRegistry(List<PaymentGateway> gateways) {
        this.map = gateways.stream()
                .collect(Collectors.toMap(PaymentGateway::supports, g -> g));
    }

    public PaymentGateway of(PaymentMethod type) {
        return map.get(type);
    }
}

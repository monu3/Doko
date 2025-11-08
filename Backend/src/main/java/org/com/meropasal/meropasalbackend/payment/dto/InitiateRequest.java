package org.com.meropasal.meropasalbackend.payment.dto;

import java.util.UUID;

/**
 * Created On : 2025 05 Sep 11:16 AM
 * Author : Monu Siddiki
 * Description :
 **/
public record InitiateRequest(
        UUID shopId,
        UUID orderId,
        long amountMinor,
        String returnUrl,
        String failureUrl
) {}

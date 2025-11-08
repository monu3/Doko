package org.com.meropasal.meropasalbackend.payment.dto;

import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 05 Sep 11:18 AM
 * Author : Monu Siddiki
 * Description :
 **/
public record VerifyRequest(
        UUID shopId,
        UUID orderId,
        String gatewayRequestId,
        Map<String, String> callbackParams
) {}

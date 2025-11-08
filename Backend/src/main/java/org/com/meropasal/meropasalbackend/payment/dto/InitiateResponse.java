package org.com.meropasal.meropasalbackend.payment.dto;

import java.util.Map;

/**
 * Created On : 2025 05 Sep 11:18 AM
 * Author : Monu Siddiki
 * Description :
 **/
public record InitiateResponse(
        String formUrl,
        Map<String, String> fields,
        String gatewayRequestId
) {}

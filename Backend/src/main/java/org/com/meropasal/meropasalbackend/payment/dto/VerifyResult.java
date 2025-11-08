package org.com.meropasal.meropasalbackend.payment.dto;

/**
 * Created On : 2025 05 Sep 11:20 AM
 * Author : Monu Siddiki
 * Description :
 **/
public record VerifyResult(
        boolean success,
        String gatewayTxnId,
        String status
) {}

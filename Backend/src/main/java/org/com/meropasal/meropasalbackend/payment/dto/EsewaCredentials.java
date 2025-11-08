package org.com.meropasal.meropasalbackend.payment.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Created On : 2025 26 Sep 8:43 PM
 * Author : Monu Siddiki
 * Description :
 **/
public record EsewaCredentials(
        @NotBlank String merchantCode,
        @NotBlank String secretKey
) implements PaymentCredentials {}

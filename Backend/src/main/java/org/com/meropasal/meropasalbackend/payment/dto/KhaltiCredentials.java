package org.com.meropasal.meropasalbackend.payment.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Created On : 2025 26 Sep 8:45 PM
 * Author : Monu Siddiki
 * Description :
 **/
public record KhaltiCredentials(
        @NotBlank String publicKey,
        @NotBlank String secretKey
)implements PaymentCredentials{
}

package org.com.meropasal.meropasalbackend.payment.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Created On : 2025 26 Sep 10:44 PM
 * Author : Monu Siddiki
 * Description :
 **/
public record BankTransferCredentials(
        @NotBlank String bankName,
        @NotBlank String accountNumber,
        String accountHolderName,
        String branchName
)implements PaymentCredentials {
}

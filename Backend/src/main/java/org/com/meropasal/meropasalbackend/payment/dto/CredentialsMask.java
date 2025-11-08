package org.com.meropasal.meropasalbackend.payment.dto;

import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.utils.CredentialsEncryptor;

/**
 * Created On : 2025 26 Sep 10:48 PM
 * Author : Monu Siddiki
 * Description :
 **/
// Masked credentials for listing
public record CredentialsMask(
        PaymentMethod paymentMethod,
        String maskedMerchantCode,
        String maskedPublicKey,
        String lastFourDigits // for bank accounts
) {
    public static CredentialsMask fromCredentials(PaymentMethod method, String encryptedCredentials, CredentialsEncryptor encryptor) {
        // Only show masked information
        return switch (method) {
            case ESEWA -> new CredentialsMask(method, "***", null, null);
            case KHALTI -> new CredentialsMask(method, null, "***", null);
            case BANK_TRANSFER -> new CredentialsMask(method, null, null, "****");
            case COD -> new CredentialsMask(method, null, null, null);
        };
    }
}

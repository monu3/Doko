package org.com.meropasal.meropasalbackend.payment.dto;

import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;

import java.util.Map;

/**
 * Created On : 2025 05 Sep 11:42 AM
 * Author : Monu Siddiki
 * Description :
 **/
public record ShopGatewaySecrets(
        //for eSewa
        String merchantCode,
        String secretKey,

        // for Khalti
        String publicKey,
        String secretKeyKhalti
) {


    // Helper method to create from PaymentCredentials
    public static ShopGatewaySecrets fromPaymentCredentials(PaymentCredentials credentials, PaymentMethod method) {
        if (credentials == null) {
            return new ShopGatewaySecrets(null, null, null, null);
        }

        return switch (method) {
            case ESEWA -> {
                EsewaCredentials esewa = (EsewaCredentials) credentials;
                yield new ShopGatewaySecrets(esewa.merchantCode(), esewa.secretKey(), null, null);
            }
            case KHALTI -> {
                KhaltiCredentials khalti = (KhaltiCredentials) credentials;
                yield new ShopGatewaySecrets(null, null, khalti.publicKey(), khalti.secretKey());
            }
            case BANK_TRANSFER -> {
                BankTransferCredentials bank = (BankTransferCredentials) credentials;
                yield new ShopGatewaySecrets(bank.accountNumber(), null, null, null);
            }
            case COD -> new ShopGatewaySecrets(null, null, null, null);
        };
    }

    // Helper methods to avoid breaking existing code
    public String secretKey() {
        return secretKey != null ? secretKey : secretKeyKhalti;
    }
}


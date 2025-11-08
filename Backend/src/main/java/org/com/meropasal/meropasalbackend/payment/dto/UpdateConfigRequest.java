package org.com.meropasal.meropasalbackend.payment.dto;

import jakarta.validation.Valid;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;

import java.util.Map;

/**
 * Created On : 2025 05 Sep 2:34 PM
 * Author : Monu Siddiki
 * Description :
 **/
public record UpdateConfigRequest(
        @Valid Map<String, Object> credentials,  // Change from PaymentCredentials to Map
        Boolean active
) {
    // Helper method to convert map to specific credentials
    public PaymentCredentials getPaymentCredentials(PaymentMethod existingPaymentMethod) {
        if (credentials == null) {
            return null; // Return null if no credentials provided in update
        }

        return switch (existingPaymentMethod) {
            case ESEWA -> new EsewaCredentials(
                    getRequiredString("merchantCode"),
                    getRequiredString("secretKey")
            );
            case KHALTI -> new KhaltiCredentials(
                    getRequiredString("publicKey"),
                    getRequiredString("secretKey")
            );
            case BANK_TRANSFER -> new BankTransferCredentials(
                    getRequiredString("bankName"),
                    getRequiredString("accountNumber"),
                    (String) credentials.get("accountHolderName"),
                    (String) credentials.get("branchName")
            );
            case COD -> new CodCredentials();
        };
    }

    private String getRequiredString(String key) {
        if (!credentials.containsKey(key) || credentials.get(key) == null) {
            throw new IllegalArgumentException("Missing required field: " + key);
        }
        return credentials.get(key).toString();
    }
}

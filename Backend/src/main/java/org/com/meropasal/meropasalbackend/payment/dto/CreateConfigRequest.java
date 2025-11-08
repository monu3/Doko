package org.com.meropasal.meropasalbackend.payment.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;

import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 05 Sep 2:33 PM
 * Author : Monu Siddiki
 * Description :
 **/
public record CreateConfigRequest(
        @NotNull UUID shopId,
        @NotNull PaymentMethod paymentMethod,
        @Valid Map<String, Object> credentials
) {
    // Helper method to convert map to specific credentials
    public PaymentCredentials getPaymentCredentials() {
        if (credentials == null) {
            throw new IllegalArgumentException("Credentials cannot be null");
        }

        return switch (paymentMethod) {
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

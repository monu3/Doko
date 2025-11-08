package org.com.meropasal.meropasalbackend.payment.Esewa;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.com.meropasal.meropasalbackend.payment.dto.InitiateRequest;
import org.com.meropasal.meropasalbackend.payment.dto.InitiateResponse;
import org.com.meropasal.meropasalbackend.payment.dto.VerifyRequest;
import org.com.meropasal.meropasalbackend.payment.dto.VerifyResult;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.repo.PaymentGateway;
import org.com.meropasal.meropasalbackend.payment.service.ShopGatewayConfigService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class EsewaGateway implements PaymentGateway {

    private final ShopGatewayConfigService cfgs;

    private static final String FORM_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    @Override
    public PaymentMethod supports() {
        return PaymentMethod.ESEWA;
    }

    @Override
    public InitiateResponse initiate(InitiateRequest req) {
        log.info("Initiating eSewa payment for order: {}", req.orderId());

        try {
            var cfg = cfgs.load(req.shopId(), PaymentMethod.ESEWA);
            String transactionUuid = UUID.randomUUID().toString();
            log.debug("Loaded config for shop: {}, transaction UUID: {}", req.shopId(), transactionUuid);

            Map<String, String> fields = new LinkedHashMap<>();
            fields.put("amount", String.valueOf(req.amountMinor() / 100));
            fields.put("tax_amount", "0");
            fields.put("total_amount", String.valueOf(req.amountMinor() / 100));
            fields.put("transaction_uuid", transactionUuid);
            fields.put("product_code", cfg.merchantCode());

            // ADD THESE TWO REQUIRED FIELDS:
            fields.put("product_service_charge", "0");
            fields.put("product_delivery_charge", "0");

            // In your initiate method, change the success URL:
//            fields.put("success_url", "http://localhost:8080/api/payments/esewa/success");
//            fields.put("failure_url", "http://localhost:8080/api/payments/esewa/failure");
            fields.put("success_url",req.returnUrl());
            fields.put("failure_url", req.failureUrl());
            fields.put("signed_field_names", "total_amount,transaction_uuid,product_code");

            String message = "total_amount=" + fields.get("total_amount") +
                    ",transaction_uuid=" + transactionUuid +
                    ",product_code=" + fields.get("product_code");
            String signature = hmacBase64(cfg.secretKey(), message);
            fields.put("signature", signature);

            
            log.info("Successfully prepared eSewa payment form for order: {}", req.orderId());

            return new InitiateResponse(FORM_URL, fields, transactionUuid);
        } catch (Exception e) {
            log.error("Failed to initiate eSewa payment for order: {}", req.orderId(), e);
            throw new RuntimeException("Payment initiation failed", e);
        }
    }

    @Override
    public VerifyResult verify(VerifyRequest req) {
        log.info("Verifying eSewa payment with request ID: {}", req.gatewayRequestId());

        try {
            var cfg = cfgs.load(req.shopId(), PaymentMethod.ESEWA);

            // Build verification URL
            String verifyUrl = String.format(
                    "https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=%s&transaction_uuid=%s",
                    cfg.merchantCode(), req.gatewayRequestId()
            );

            log.debug("Calling eSewa verification API: {}", verifyUrl);

            // Make verification request to eSewa
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(verifyUrl, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                // Parse response (example format, check eSewa docs for actual format)
                JsonObject jsonResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
                String status = jsonResponse.get("status").getAsString();

                log.debug("eSewa verification response: {}", jsonResponse);

                if ("COMPLETE".equals(status)) {
                    log.info("eSewa payment verified successfully for request ID: {}", req.gatewayRequestId());
                    return new VerifyResult(true, req.gatewayRequestId(), "COMPLETED");
                }
            }

            log.warn("eSewa payment verification failed for request ID: {}", req.gatewayRequestId());
            return new VerifyResult(false, req.gatewayRequestId(), "FAILED");
        } catch (Exception e) {
            log.error("Error during eSewa payment verification for request ID: {}", req.gatewayRequestId(), e);
            return new VerifyResult(false, req.gatewayRequestId(), "ERROR");
        }
    }

    private String hmacBase64(String key, String message) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            return Base64.getEncoder().encodeToString(sha256_HMAC.doFinal(message.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Error creating HMAC", e);
        }
    }

    private String buildAutoPostHtml(String action, Map<String, String> fields) {
        StringBuilder sb = new StringBuilder("<html><body onload='document.forms[0].submit()'>")
                .append("<form method='POST' action='").append(action).append("'>");
        fields.forEach((k, v) -> sb.append("<input type='hidden' name='").append(k).append("' value='").append(v).append("'/>"));
        sb.append("</form></body></html>");
        return sb.toString();
    }
}
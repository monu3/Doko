package org.com.meropasal.meropasalbackend.payment.controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.com.meropasal.meropasalbackend.payment.entity.Payment;
import org.com.meropasal.meropasalbackend.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 05 Sep 3:33 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Slf4j
@RestController
@RequestMapping("/api/payments/esewa")
@RequiredArgsConstructor
public class EsewaCallbackController {

    private final PaymentService paymentService;

    @PostMapping("/success")
    public void handleSuccessPost(@RequestParam Map<String, String> allParams, HttpServletResponse response) throws IOException {
        handleEsewaCallback(allParams, "success", response);
    }

    @GetMapping("/success")
    public void handleSuccessGet(@RequestParam Map<String, String> allParams, HttpServletResponse response) throws IOException {
        handleEsewaCallback(allParams, "success", response);
    }

    @PostMapping("/failure")
    public void handleFailurePost(@RequestParam Map<String, String> allParams, HttpServletResponse response) throws IOException {
        handleEsewaCallback(allParams, "failure", response);
    }

    @GetMapping("/failure")
    public void handleFailureGet(@RequestParam Map<String, String> allParams, HttpServletResponse response) throws IOException {
        handleEsewaCallback(allParams, "failure", response);
    }

    private void handleEsewaCallback(Map<String, String> allParams, String callbackType, HttpServletResponse response) throws IOException {
        try {
            log.info("eSewa {} callback received with parameters: {}", callbackType, allParams);

            String data = allParams.get("data");

            if (data != null && !data.isEmpty()) {
                String decodedData = new String(Base64.getDecoder().decode(data));
                JsonObject jsonData = JsonParser.parseString(decodedData).getAsJsonObject();

                String transactionUuid = jsonData.get("transaction_uuid").getAsString();
                String status = jsonData.get("status").getAsString();
                String totalAmount = jsonData.get("total_amount").getAsString();

                // Get transaction_code if available, otherwise use transaction_uuid
                String transactionCode = jsonData.has("transaction_code")
                        ? jsonData.get("transaction_code").getAsString()
                        : jsonData.has("transaction_code")
                        ? jsonData.get("transaction_code").getAsString()
                        : transactionUuid;

                log.info("Processing eSewa payment - transactionUuid: {}, status: {}, amount: {}",
                        transactionUuid, status, totalAmount);

                if ("success".equals(callbackType) && "COMPLETE".equals(status)) {
                    Payment updatedPayment = paymentService.handleEsewaSuccess(transactionUuid, transactionCode, totalAmount);
                    log.info("Successfully processed payment for transaction: {}", transactionCode);
                } else {
                    paymentService.handleEsewaFailure(transactionUuid, decodedData);
                    log.info("Payment failed for transaction: {}", transactionUuid);
                }
            } else {
                log.warn("No data parameter in eSewa {} callback", callbackType);
            }

            // Redirect to frontend with appropriate status
            String frontendRedirect = allParams.get("frontendRedirect");
            String redirectUrl = buildFrontendRedirectUrl(frontendRedirect, data, callbackType);
            log.info("Redirecting to: {}", redirectUrl);
            response.sendRedirect(redirectUrl);

        } catch (Exception e) {
            log.error("Error processing eSewa {} callback", callbackType, e);
            String frontendRedirect = allParams.get("frontendRedirect");
            String redirectUrl = buildFrontendRedirectUrl(frontendRedirect, null, "error");
            response.sendRedirect(redirectUrl);
        }
    }

    private String buildFrontendRedirectUrl(String frontendRedirect, String data, String callbackType) {
        String baseUrl = "http://localhost:2025/customerView";

        if (frontendRedirect != null && !frontendRedirect.isEmpty()) {
            baseUrl = frontendRedirect;
        }

        // Extract transaction UUID from data if available
        String transactionUuid = null;
        if (data != null && !data.isEmpty()) {
            try {
                String decodedData = new String(Base64.getDecoder().decode(data));
                JsonObject jsonData = JsonParser.parseString(decodedData).getAsJsonObject();
                transactionUuid = jsonData.get("transaction_uuid").getAsString();
            } catch (Exception e) {
                log.warn("Failed to extract transaction UUID from data", e);
            }
        }

        String statusParam = "success".equals(callbackType) ? "success" :
                "failure".equals(callbackType) ? "failure" : "error";

        String url = String.format("%s?paymentStatus=%s", baseUrl, statusParam);

        if (transactionUuid != null) {
            url += "&transactionId=" + transactionUuid;
        }

        return url;
    }
}
package org.com.meropasal.meropasalbackend.payment.controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.com.meropasal.meropasalbackend.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;
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

    @GetMapping("/success")
    public ResponseEntity<String> handleSuccess(@RequestParam String data) {
        try {
            // Decode and parse the data
            String decodedData = new String(Base64.getDecoder().decode(data));
            JsonObject jsonData = JsonParser.parseString(decodedData).getAsJsonObject();

            String transactionUuid = jsonData.get("transaction_uuid").getAsString();
            String transactionCode = jsonData.get("transaction_code").getAsString();
            String totalAmount = jsonData.get("total_amount").getAsString();
            String status = jsonData.get("status").getAsString();

            if ("COMPLETE".equals(status)) {
                // THIS IS THE MISSING CALL!
                paymentService.handleEsewaSuccess(transactionUuid, transactionCode, totalAmount);
                return ResponseEntity.ok("Payment processed successfully");
            }

        } catch (Exception e) {
            log.error("Error in callback", e);
        }
        return ResponseEntity.badRequest().body("Payment failed");
    }


    @GetMapping("/failure")
    public ResponseEntity<String> handleFailure(@RequestParam String data) {
        try {
            String decodedData = new String(Base64.getDecoder().decode(data));
            JsonObject jsonData = JsonParser.parseString(decodedData).getAsJsonObject();

            String transactionUuid = jsonData.get("transaction_uuid").getAsString();

            // Call service to mark failure
            paymentService.handleEsewaFailure(transactionUuid, decodedData);

            log.error("eSewa failure callback data: {}", decodedData);
            return ResponseEntity.badRequest().body("Payment failed");
        } catch (Exception e) {
            log.error("Error processing eSewa failure callback", e);
            return ResponseEntity.badRequest().body("Error processing payment failure");
        }
    }

}

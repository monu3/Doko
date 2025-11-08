package org.com.meropasal.meropasalbackend.payment.controller;

import lombok.RequiredArgsConstructor;
import org.com.meropasal.meropasalbackend.payment.dto.InitiateResponse;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 05 Sep 1:09 PM
 * Author : Monu Siddiki
 * Description :
 **/
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/{shopId}/{paymentMethod}/init")
    public ResponseEntity<InitiateResponse> initiate(
            @PathVariable UUID shopId,
            @PathVariable PaymentMethod paymentMethod,
            @RequestBody Map<String,Object> dto) {
        var res = paymentService.startPayment(
                shopId, paymentMethod,
                UUID.fromString(dto.get("orderId").toString()),
                Long.parseLong(dto.get("amountMinor").toString()),
                dto.get("returnUrl").toString(),
                dto.get("failureUrl").toString()
        );
        return ResponseEntity.ok(res); // frontend can render this HTML
    }

    @GetMapping("/{shopId}/{paymentMethod}/callback")
    public ResponseEntity<String> callback(
            @PathVariable UUID shopId,
            @PathVariable PaymentMethod paymentMethod,
            @RequestParam Map<String,String> params) {

        // For Khalti, we need to handle both pidx and transaction_uuid
        if (paymentMethod == PaymentMethod.KHALTI) {
            // Extract pidx and add it to params as gatewayRequestId
            String pidx = params.get("pidx");
            params.put("gatewayRequestId", pidx); // Add this for consistency
        }

        var result = paymentService.handleCallback(shopId, paymentMethod, params);
        return ResponseEntity.ok("Payment Status: " + result.status());
    }
}


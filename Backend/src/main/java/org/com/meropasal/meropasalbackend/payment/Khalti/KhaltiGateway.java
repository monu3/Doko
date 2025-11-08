// package org.com.meropasal.meropasalbackend.payment.Khalti;

// import com.google.gson.JsonObject;
// import com.google.gson.JsonParser;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.com.meropasal.meropasalbackend.payment.dto.InitiateRequest;
// import org.com.meropasal.meropasalbackend.payment.dto.InitiateResponse;
// import org.com.meropasal.meropasalbackend.payment.dto.VerifyRequest;
// import org.com.meropasal.meropasalbackend.payment.dto.VerifyResult;
// import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
// import org.com.meropasal.meropasalbackend.payment.repo.PaymentGateway;
// import org.com.meropasal.meropasalbackend.payment.service.ShopGatewayConfigService;
// import org.springframework.http.*;
// import org.springframework.stereotype.Component;
// import org.springframework.web.client.RestTemplate;

// import java.util.HashMap;
// import java.util.Map;

// @Slf4j
// @Component
// @RequiredArgsConstructor
// public class KhaltiGateway implements PaymentGateway {

//     private final ShopGatewayConfigService cfgs;
//     private final RestTemplate restTemplate;
//     // REMOVED: private final ShopGatewaySecrets cfg; // ← THIS CAUSES COMPILATION ERROR

//     private static final String INITIATE_URL = "https://a.khalti.com/api/v2/epayment/initiate/";
//     private static final String LOOKUP_URL = "https://a.khalti.com/api/v2/epayment/lookup/";

//     @Override
//     public PaymentMethod supports() {
//         return PaymentMethod.KHALTI;
//     }

//     @Override
//     public InitiateResponse initiate(InitiateRequest req) {
//         log.info("Initiating Khalti payment for order: {}", req.orderId());

//         try {
//             var cfg = cfgs.load(req.shopId(), PaymentMethod.KHALTI);
//             log.debug("Loaded Khalti config: publicKey={}", cfg.publicKey());

//             Map<String, Object> payload = new HashMap<>();
//             payload.put("return_url", req.returnUrl());
//             payload.put("website_url", "https://meropasal.com");
//             payload.put("amount", req.amountMinor());
//             payload.put("purchase_order_id", req.orderId().toString());
//             payload.put("purchase_order_name", "Order #" + req.orderId());

//             Map<String, String> customerInfo = new HashMap<>();
//             customerInfo.put("name", "Customer");
//             customerInfo.put("email", "customer@example.com");
//             customerInfo.put("phone", "9800000000");
//             payload.put("customer_info", customerInfo);

//             HttpHeaders headers = new HttpHeaders();
//             headers.setContentType(MediaType.APPLICATION_JSON);
//             headers.set("Authorization", "Key " + cfg.publicKey());

//             log.debug("Request headers: {}", headers);
//             log.debug("Request payload: {}", payload);

//             HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

//             ResponseEntity<String> response = restTemplate.exchange(
//                     INITIATE_URL, HttpMethod.POST, entity, String.class);

//             log.debug("Khalti response: {}", response.getBody());

//             if (response.getStatusCode() == HttpStatus.OK) {
//                 JsonObject jsonResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
//                 String pidx = jsonResponse.get("pidx").getAsString();
//                 String paymentUrl = jsonResponse.get("payment_url").getAsString();

//                 String html = buildRedirectHtml(paymentUrl);
//                 log.info("Khalti payment initiated successfully. pidx: {}", pidx);
//                 return new InitiateResponse(html, pidx);
//             } else {
//                 throw new RuntimeException("Khalti initiation failed: " + response.getBody());
//             }

//         } catch (Exception e) {
//             log.error("Khalti initiation failed", e);
//             throw new RuntimeException("Khalti payment initiation failed", e);
//         }
//     }

//     @Override
//     public VerifyResult verify(VerifyRequest req) {
//         log.info("Verifying Khalti payment with pidx: {}", req.gatewayRequestId());

//         try {
//             var cfg = cfgs.load(req.shopId(), PaymentMethod.KHALTI);

//             HttpHeaders headers = new HttpHeaders();
//             headers.set("Authorization", "Key " + cfg.secretKey()); // This is CORRECT for verification

//             HttpEntity<String> entity = new HttpEntity<>(headers);

//             ResponseEntity<String> response = restTemplate.exchange(
//                     LOOKUP_URL + "?pidx=" + req.gatewayRequestId(),
//                     HttpMethod.GET, entity, String.class);

//             if (response.getStatusCode() == HttpStatus.OK) {
//                 JsonObject jsonResponse = JsonParser.parseString(response.getBody()).getAsJsonObject();
//                 String status = jsonResponse.get("status").getAsString();
//                 String transactionId = jsonResponse.get("transaction_id").getAsString();

//                 boolean success = "Completed".equals(status);
//                 log.info("Khalti payment verification status: {}", status);

//                 return new VerifyResult(success, transactionId, status);
//             } else {
//                 log.warn("Khalti payment verification failed for pidx: {}", req.gatewayRequestId());
//                 return new VerifyResult(false, null, "VERIFICATION_FAILED");
//             }
//         } catch (Exception e) {
//             log.error("Error during Khalti payment verification for pidx: {}", req.gatewayRequestId(), e);
//             return new VerifyResult(false, null, "ERROR");
//         }
//     }

//     private String buildRedirectHtml(String paymentUrl) {
//         return "<html><body><script>window.location.href = '" + paymentUrl + "';</script></body></html>";
//     }
// }
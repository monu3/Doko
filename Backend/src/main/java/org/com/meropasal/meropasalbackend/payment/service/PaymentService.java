package org.com.meropasal.meropasalbackend.payment.service;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.com.meropasal.meropasalbackend.payment.dto.InitiateRequest;
import org.com.meropasal.meropasalbackend.payment.dto.InitiateResponse;
import org.com.meropasal.meropasalbackend.payment.dto.VerifyRequest;
import org.com.meropasal.meropasalbackend.payment.dto.VerifyResult;
import org.com.meropasal.meropasalbackend.payment.entity.Payment;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentStatus;
import org.com.meropasal.meropasalbackend.payment.repo.PaymentRepository;
import org.com.meropasal.meropasalbackend.shop.repo.ShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 05 Sep 12:01 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository repo;
    private final GatewayRegistry registry;
    private final ShopRepository shopRepo;

    @Transactional
    public InitiateResponse startPayment(UUID shopId, PaymentMethod paymentMethod,
                                         UUID orderId, Long amountMinor,
                                         String returnUrl, String failureUrl) {
        InitiateRequest req = new InitiateRequest(shopId, orderId, amountMinor, returnUrl, failureUrl);
        InitiateResponse res = registry.of(paymentMethod).initiate(req);

        Payment p = new Payment();
        p.setShop(shopRepo.getReferenceById(shopId));
        p.setPaymentMethod(paymentMethod);
        p.setOrderId(orderId);
        p.setAmountMinor(amountMinor);
        p.setGatewayRequestId(res.gatewayRequestId());
        p.setStatus(PaymentStatus.INITIATED);
        repo.save(p);

        return res;
    }

    @Transactional
    public void handleEsewaSuccess(String transactionUuid, String transactionCode, String amount) {
        // Find payment by gateway request ID (transaction_uuid)
        Optional<Payment> paymentOpt = repo.findByGatewayRequestId(transactionUuid);

        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setGatewayTxnId(transactionCode);
            payment.setRawCallbackJson("Success data received");
            repo.save(payment);

            log.info("Payment marked as completed for transaction: {}", transactionCode);
        } else {
            log.warn("Payment not found for transaction UUID: {}", transactionUuid);
        }
    }

    @Transactional
    public void handleEsewaFailure(String transactionUuid, String rawData) {
        // Find payment by gateway request ID (transaction_uuid)
        Optional<Payment> paymentOpt = repo.findByGatewayRequestId(transactionUuid);

        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setStatus(PaymentStatus.FAILED);
            payment.setRawCallbackJson(rawData); // Store raw failure payload for debugging/auditing
            repo.save(payment);

            log.info("Payment marked as FAILED for transaction UUID: {}", transactionUuid);
        } else {
            log.warn("Payment not found for transaction UUID (failure): {}", transactionUuid);
        }
    }

    @Transactional
    public VerifyResult handleCallback(UUID shopId, PaymentMethod paymentMethod, Map<String,String> params) {
        String requestId;

        // Determine the request ID based on payment method
        if (paymentMethod == PaymentMethod.KHALTI) {
            requestId = params.getOrDefault("pidx", "");
        } else {
            requestId = params.getOrDefault("transaction_uuid", "");
        }

        VerifyRequest req = new VerifyRequest(shopId, null, requestId, params);
        VerifyResult result = registry.of(paymentMethod).verify(req);

        repo.findByGatewayRequestIdAndPaymentMethod(requestId, paymentMethod).ifPresent(p -> {
            p.setStatus(result.success() ? PaymentStatus.COMPLETED : PaymentStatus.FAILED);
            p.setGatewayTxnId(result.gatewayTxnId());
            p.setRawCallbackJson(new Gson().toJson(params));
            repo.save(p);
        });

        return result;
    }
}


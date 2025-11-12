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
        p.setReturnUrl(returnUrl);
        p.setFailureUrl(failureUrl);
        repo.save(p);

        return res;
    }

    @Transactional
    public Payment handleEsewaSuccess(String transactionUuid, String transactionCode, String amount) {
        log.info("Looking for payment with gatewayRequestId: {}", transactionUuid);

        Optional<Payment> paymentOpt = repo.findByGatewayRequestId(transactionUuid);

        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();

            // Only update if not already completed
            if (payment.getStatus() != PaymentStatus.COMPLETED) {
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setGatewayTxnId(transactionCode);
                payment.setRawCallbackJson("Success data received");
                Payment savedPayment = repo.save(payment);

                log.info("Payment marked as COMPLETED for transaction: {}, orderId: {}",
                        transactionCode, payment.getOrderId());
                return savedPayment;
            } else {
                log.info("Payment already completed for transaction: {}", transactionCode);
                return payment;
            }
        } else {
            // Try to find by transaction code if not found by UUID
            paymentOpt = repo.findByGatewayTxnId(transactionCode);
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setGatewayTxnId(transactionCode);
                Payment savedPayment = repo.save(payment);
                log.info("Payment found by transaction code and marked as COMPLETED: {}", transactionCode);
                return savedPayment;
            }

            log.warn("Payment not found for transaction UUID: {}", transactionUuid);
            throw new RuntimeException("Payment not found for transaction UUID: " + transactionUuid);
        }
    }

    @Transactional
    public Payment handleEsewaFailure(String transactionUuid, String rawData) {
        Optional<Payment> paymentOpt = repo.findByGatewayRequestId(transactionUuid);

        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setStatus(PaymentStatus.FAILED);
            payment.setRawCallbackJson(rawData);
            Payment savedPayment = repo.save(payment);

            log.info("Payment marked as FAILED for transaction UUID: {}", transactionUuid);
            return savedPayment;
        } else {
            log.warn("Payment not found for transaction UUID (failure): {}", transactionUuid);
            throw new RuntimeException("Payment not found for transaction UUID: " + transactionUuid);
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


package org.com.meropasal.meropasalbackend.payment.repo;

import org.com.meropasal.meropasalbackend.payment.dto.InitiateRequest;
import org.com.meropasal.meropasalbackend.payment.dto.InitiateResponse;
import org.com.meropasal.meropasalbackend.payment.dto.VerifyRequest;
import org.com.meropasal.meropasalbackend.payment.dto.VerifyResult;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;

import java.util.Optional;

/**
 * Created On : 2025 05 Sep 11:25 AM
 * Author : Monu Siddiki
 * Description :
 **/
public interface PaymentGateway {
    PaymentMethod supports();

    InitiateResponse initiate(InitiateRequest req);

    VerifyResult verify(VerifyRequest req);

//    Optional<VerifyResult> lookup(String shopId, String gatewayRequestId);
}

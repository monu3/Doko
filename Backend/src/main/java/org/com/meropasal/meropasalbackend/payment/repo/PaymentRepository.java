package org.com.meropasal.meropasalbackend.payment.repo;

import org.com.meropasal.meropasalbackend.payment.entity.Payment;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 05 Sep 11:50 AM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByGatewayRequestIdAndPaymentMethod(String requestId, PaymentMethod type);

    List<Payment> findByStatus(PaymentStatus status);

    Optional<Payment> findByGatewayRequestId(String transactionUuid);
}

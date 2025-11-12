package org.com.meropasal.meropasalbackend.payment.entity;

/**
 * Created On : 2025 05 Feb 4:47 PM
 * Author : Monu Siddiki
 * Description :
 **/
import jakarta.persistence.*;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.order.entity.Order;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentStatus;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.hibernate.annotations.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment",
        indexes = {
                @Index(name = "idx_payment_order", columnList = "order_id"),
                @Index(name = "idx_payment_created_at", columnList = "createdAt")
        })
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE payments SET deleted = true WHERE id=?")
@Where(clause = "deleted = false")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod; // e.g., CREDIT_CARD, PAYPAL, COD


    private UUID orderId;

    private Long amountMinor; // always in paisa

    private String currency = "NPR";

    private String gatewayTxnId;   // txn from gateway
    private String gatewayRequestId; // pidx (Khalti) / uuid (eSewa)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status; // e.g., PENDING, COMPLETED, FAILED

    @Lob
    private String rawCallbackJson;

    @Column(name = "return_url")
    private String returnUrl;

    @Column(name = "failure_url")
    private String failureUrl;


    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate(){
        updatedAt = LocalDateTime.now();
    }

    @ColumnDefault("false")
    private boolean deleted = false;

//    // Additional fields for payment gateway integration
//    @Column(name = "transaction_id")
//    private String transactionId; // Gateway transaction ID
//
//    @Column(name = "gateway_response", columnDefinition = "JSON")
//    private String gatewayResponse; // Raw response from payment gateway
}
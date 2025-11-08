package org.com.meropasal.meropasalbackend.payment.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.com.meropasal.meropasalbackend.payment.dto.*;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.utils.CredentialsEncryptor;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.annotations.Where;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Created On : 2025 05 Sep 10:46 AM
 * Author : Monu Siddiki
 * Description :
 **/
@Slf4j
@Entity
@Table(name = "store_gateway_config")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE store_gateway_config SET deleted = true WHERE id=?")
@Where(clause = "deleted = false")
public class ShopGatewayConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod; // ESEWA, KHALTI


    @Column(columnDefinition = "TEXT")
    private String encryptedCredentials;

    private boolean active;

    @ColumnDefault("false")
    private boolean deleted = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Encrypt and set credentials
    public void setCredentials(PaymentCredentials credentials, CredentialsEncryptor encryptor, ObjectMapper mapper) {
        try {
            String json = mapper.writeValueAsString(credentials);
            this.encryptedCredentials = encryptor.encrypt(json);
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt credentials", e);
        }
    }

    // Decrypt and get credentials
    public PaymentCredentials getCredentials(CredentialsEncryptor encryptor, ObjectMapper mapper) {
        try {
            String decryptedJson = encryptor.decrypt(this.encryptedCredentials);
            return mapper.readValue(decryptedJson, getCredentialsType());
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt credentials", e);
        }
    }

    private Class<? extends PaymentCredentials> getCredentialsType() {
        return switch (this.paymentMethod) {
            case ESEWA -> EsewaCredentials.class;
            case KHALTI -> KhaltiCredentials.class;
            case BANK_TRANSFER -> BankTransferCredentials.class;
            case COD -> CodCredentials.class;
        };
    }

}

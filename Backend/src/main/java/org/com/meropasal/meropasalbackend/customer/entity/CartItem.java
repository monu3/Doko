package org.com.meropasal.meropasalbackend.customer.entity;

/**
 * Created On : 2025 08 Feb 9:34 PM
 * Author : Monu Siddiki
 * Description :
 **/
import jakarta.persistence.*;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.product.entity.Product;
import org.hibernate.annotations.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "cart_items",
        indexes = {
                @Index(name = "idx_cartitem_product", columnList = "product_id")
        })
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; // Snapshot of product price at time of addition

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "selected_variant")
    private String selectedVariant; // JSON string for product variants

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerDetails customer;


    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        calculateTotalPrice(); // ensure subPrice is correct before insert
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate(){
        calculateTotalPrice(); // ensure subPrice is correct before insert
        updatedAt = LocalDateTime.now();
    }


    // Helper method to calculate total price
    public void calculateTotalPrice() {
        if (price == null || quantity == null) {
            throw new IllegalStateException("Price and quantity must not be null to calculate total price.");
        }
        this.totalPrice = price.multiply(BigDecimal.valueOf(quantity));
    }

    // Update quantity and recalculate total price
    public void updateQuantity(int newQuantity) {
        if (newQuantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        this.quantity = newQuantity;
        calculateTotalPrice();
    }
}


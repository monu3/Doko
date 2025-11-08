package org.com.meropasal.meropasalbackend.customer.entity;

/**
 * Created On : 2025 05 Feb 7:56 PM
 * Author : Monu Siddiki
 * Description :
 **/
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.authSystem.entity.Users;
import org.com.meropasal.meropasalbackend.authSystem.enums.UserRole;
import org.com.meropasal.meropasalbackend.follower.entity.Follower;
import org.com.meropasal.meropasalbackend.order.entity.Order;
import org.hibernate.annotations.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "customer_details",
        indexes = {
                @Index(name = "idx_customer_created_at", columnList = "createdAt")
        })
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE customer_details SET deleted = true WHERE id=?")
@Where(clause = "deleted = false")
public class CustomerDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;
//
//    @OneToOne
//    @JoinColumn(name = "order_id", nullable = false)
//    private Order order; // The order associated with these details

    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must be less than 255 characters")
    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private boolean verified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ColumnDefault("false")
    private boolean deleted = false;

    // Relationships
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CartItem> cartItems;


    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WishlistItem> wishlistItems;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate(){
        updatedAt = LocalDateTime.now();
    }
}

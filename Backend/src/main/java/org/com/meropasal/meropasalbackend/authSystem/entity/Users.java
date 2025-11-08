package org.com.meropasal.meropasalbackend.authSystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.authSystem.enums.UserRole;
import org.com.meropasal.meropasalbackend.follower.entity.Follower;
import org.com.meropasal.meropasalbackend.order.entity.Order;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Created On : 2025 26 Jan 11:59 AM
 * Author : Monu Siddiki
 * Description :
 **/

@Entity
@Table(name = "users",
        indexes = {
                @Index(name = "idx_user_email", columnList = "email", unique = true),
                @Index(name = "idx_user_role", columnList = "role"),
                @Index(name = "idx_user_created_at", columnList = "createdAt")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uc_user_email", columnNames = {"email"})
        })
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE users SET deleted = true WHERE id=?")
@Where(clause = "deleted = false")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email;


    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    @JsonIgnore // Never serialize password to JSON responses
    private String password;


    @Column(name = "email_verified")
    private boolean enabled; // To check if the user is verified


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role ;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ColumnDefault("false")
    private boolean deleted = false;


    @OneToOne(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Shop shop; // Only for SHOP_OWNER role




    // Security validation for shop ownership
    public void setShop(Shop shop) {
        if (this.role != UserRole.SHOP_OWNER) {
            throw new IllegalStateException("Only SHOP_OWNER can have a shop");
        }
        this.shop = shop;
        if (shop != null) {
            shop.setOwner(this);
        }
    }

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

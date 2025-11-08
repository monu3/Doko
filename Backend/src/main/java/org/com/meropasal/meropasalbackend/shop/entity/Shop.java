package org.com.meropasal.meropasalbackend.shop.entity;

/**
 * Created On : 2025 05 Feb 11:08 AM
 * Author : Monu Siddiki
 * Description :
 **/
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.address.entity.Address;
import org.com.meropasal.meropasalbackend.authSystem.entity.Users;
import org.com.meropasal.meropasalbackend.category.entity.Category;
import org.com.meropasal.meropasalbackend.order.entity.Order;
import org.com.meropasal.meropasalbackend.product.entity.Product;
import org.com.meropasal.meropasalbackend.shop.enums.District;
import org.com.meropasal.meropasalbackend.shop.enums.Province;
import org.com.meropasal.meropasalbackend.socialMediaAndSupport.entity.SocialAccount;
import org.hibernate.annotations.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "shop",
        indexes = {
                @Index(name = "idx_shop_url", columnList = "shopUrl", unique = true),
                @Index(name = "idx_shop_owner", columnList = "owner_id"),
                @Index(name = "idx_shop_created_at", columnList = "createdAt")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uc_shop_url", columnNames = {"shopUrl"})
        })
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE shops SET deleted = true WHERE id=?")
@Where(clause = "deleted = false")
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Size(min = 3, max = 50, message = "Shop URL must be between 3-50 characters")
    @Column(name = "shop_url", unique = true)
    private String shopUrl;

    @Size(max = 100, message = "Business name must be less than 100 characters")
    @Column(nullable = false)
    private String businessName;


    @Column
    private String theme;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private District district=District.KATHMANDU;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Province province=Province.BAGMATI_PROVINCE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @Embedded
    private Address address;

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

    // Relationships

    @OneToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Users owner; // Shop owner (linked to User entity)

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();

//    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Follower> followers = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "shop" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Category> categories = new ArrayList<>();

    @OneToOne(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    private SocialAccount socialAccount;

    @Column(name = "logo_url")
    private String logoUrl; // URL to shop logo


    @Column(name = "is_active")
    private boolean active = true; // Shop activation status

    // Helper method to add a product
    public void addProduct(Product product) {
        products.add(product);
        product.setShop(this);
    }

    // Helper method to remove a product
    public void removeProduct(Product product) {
        products.remove(product);
        product.setShop(null);
    }
}

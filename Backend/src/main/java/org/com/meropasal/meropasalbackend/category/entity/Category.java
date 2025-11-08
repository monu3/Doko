package org.com.meropasal.meropasalbackend.category.entity;

/**
 * Created On : 2025 05 Feb 4:54 PM
 * Author : Monu Siddiki
 * Description :
 **/
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.product.entity.Product;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.hibernate.annotations.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "category",
        indexes = {
                @Index(name = "idx_category_name", columnList = "name"),
                @Index(name = "idx_category_created_at", columnList = "createdAt")
        })
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE categories SET deleted = true WHERE id=?")
@Where(clause = "deleted = false")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Size(max = 100, message = "Category name must be less than 100 characters")
    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "category_image_url")
    private String categoryUrl; // URL to category image

    @Column(name = "banner_image_url")
    private String bannerUrl; // URL to banner image

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

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

    @Column
    private boolean active=true ;

    // Relationships

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products; // Products in this category
//
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="shop_id",nullable = false)
    @JsonIgnore
    private Shop shop;

//    // Instead of mapping the entire Shop object, map only the shopId
//    @Column(name = "shop_id", nullable = false, updatable = false)
//    private UUID shopId;
}

package org.com.meropasal.meropasalbackend.product.entity;

/**
 * Created On : 2025 05 Feb 2:51 PM
 * Author : Monu Siddiki
 * Description :
 **/
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.*;
import org.com.meropasal.meropasalbackend.category.entity.Category;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.hibernate.annotations.*;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "products",
        indexes = {
                @Index(name = "idx_product_name", columnList = "name"),
                @Index(name = "idx_product_shop", columnList = "shop_id"),
                @Index(name = "idx_product_category", columnList = "category_id"),
                @Index(name = "idx_product_created_at", columnList = "createdAt"),
                @Index(name = "idx_product_price", columnList = "price"),
                @Index(name = "idx_product_discount", columnList = "discount_percentage")
        })
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE products SET deleted = true WHERE id=?")
@Where(clause = "deleted = false")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Size(max = 200, message = "Product name must be less than 200 characters")
    @Column(nullable = false)
    private String name;

    @Size(max = 1000, message = "Product description must be less than 1000 characters")
    @Column
    private String description;

    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @DecimalMin(value = "0.01", message = "DiscountPrice must be greater than 0")
    @Column(precision = 10, scale = 2)
    private BigDecimal discountPrice;

    @DecimalMin(value = "0.01", message = "discountPercentage must be greater than 0")
    @Column(precision = 10, scale = 2)
    private BigDecimal discountPercentage;

    @Min(value = 0, message = "Stock quantity cannot be negative")
    @Column(nullable = false)
    private Integer stock;

//    @NotBlank(message = "SKU is required")
//    @Size(max = 50, message = "SKU must be less than 50 characters")
//    @Column(nullable = false, unique = true)
//    private String sku;

    @Column(name = "image_url")
    private String imageUrl; // URL to product image

    // JSONB storage for multiple images
    @Column(name = "images_json", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String imagesJson; // Stores List<String> image URLs as JSON


//    @ElementCollection // <-- ADDED: to store multiple image URLs
//    @CollectionTable(
//            name = "product_images",       // table to store images
//            joinColumns = @JoinColumn(name = "product_id") // foreign key to Product
//    )
//    @Column(name = "image_url", length = 500) // each URL is stored under 'image_url' column
//    private List<String> images = new ArrayList<>(); // multiple image URLs


    @Column
    private boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateAndSetDiscountPrice(); // auto-calculate discount price
    }

    @PreUpdate
    protected void onUpdate(){
        updatedAt = LocalDateTime.now();
        calculateAndSetDiscountPrice(); // auto-calculate discount price
    }

    @ColumnDefault("false")
    private boolean deleted = false;

    // Relationships

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    @JsonIgnore
    private Shop shop; // The shop that owns this product

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category; // Optional category for the product

    // Simple variant support
    private Boolean hasVariants = false;

    // Use JSONB for better performance
    @Column(name = "variant_data", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String variantData;

    // Helper methods for images data
    // Helper methods for images JSON
    public List<String> getImages() {
        if (this.imagesJson == null || this.imagesJson.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(this.imagesJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public void setImages(List<String> images) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.imagesJson = mapper.writeValueAsString(images != null ? images : new ArrayList<>());

            // Maintain backward compatibility - set first image as primary
            if (images != null && !images.isEmpty() && this.imageUrl == null) {
                this.imageUrl = images.get(0);
            }
        } catch (Exception e) {
            this.imagesJson = "[]";
        }
    }

    // JSON helper methods for variant data
    public ProductVariantData getVariantDataObject() {
        if (this.variantData == null || this.variantData.trim().isEmpty()) {
            return new ProductVariantData();
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(this.variantData, ProductVariantData.class);
        } catch (Exception e) {
            // Log error and return empty object
            System.err.println("Error parsing variant data: " + e.getMessage());
            return new ProductVariantData();
        }
    }

    public void setVariantDataObject(ProductVariantData variantData) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.variantData = mapper.writeValueAsString(variantData);
        } catch (Exception e) {
            // Log error and set empty JSON
            System.err.println("Error serializing variant data: " + e.getMessage());
            this.variantData = "{}";
        }
    }

    /**
     * Calculates and sets the discount price based on the price and discount percentage.
     * This method is called automatically before the entity is persisted or updated.
     */
    public void calculateAndSetDiscountPrice() {
        // If discount percentage is null, zero, or negative, there is no discount.
        // Set the discountPrice to the original price.
        if (this.price == null || this.discountPercentage == null || this.discountPercentage.compareTo(BigDecimal.ZERO) <= 0) {
            this.discountPrice = this.price;
            return;
        }

        // A discount percentage over 100 is invalid.
        if (this.discountPercentage.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Discount percentage cannot be greater than 100.");
        }

        BigDecimal discountAmount = this.price.multiply(this.discountPercentage).divide(BigDecimal.valueOf(100));
        this.discountPrice = this.price.subtract(discountAmount).setScale(2, RoundingMode.HALF_UP);
    }

    private void ensureImagesConsistency() {
        List<String> images = getImages();
        if (images != null && !images.isEmpty() && this.imageUrl == null) {
            this.imageUrl = images.get(0);
        }
    }

    // Helper method to add image
    public void addImage(String imageUrl) {
        List<String> images = getImages();
        images.add(imageUrl);
        setImages(images);
    }

    // Helper method to remove image
    public void removeImage(String imageUrl) {
        List<String> images = getImages();
        images.removeIf(img -> img.equals(imageUrl));
        setImages(images);
    }


    // Helper method to update stock
    public void updateStock(int quantity) {
        if (this.stock + quantity < 0) {
            throw new IllegalArgumentException("Insufficient stock");
        }
        this.stock += quantity;
    }
}

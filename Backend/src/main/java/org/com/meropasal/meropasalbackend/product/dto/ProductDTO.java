package org.com.meropasal.meropasalbackend.product.dto;


import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Created On : 2025 05 Feb 2:54 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private UUID id;

    @Size(max = 200)
    private String name;

    @Size(max = 1000)
    private String description;

    @DecimalMin(value = "0.01")
    private BigDecimal price;

    @DecimalMin(value = "0.01")
    private BigDecimal discountPrice;

    @DecimalMin(value = "0.01")
    private BigDecimal discountPercentage;

    @Min(value = 0)
    private Integer stock;

//    @NotBlank(message = "SKU is required")
//    @Size(max = 50)
//    private String sku;

    private String imageUrl; //for single image

    private List<String> images = new ArrayList<>();

//    // ADDED: multiple images
//    private List<String> images; // store multiple image URLs

    private boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private UUID shopId;
    private UUID categoryId; // Optional category ID

    // Simple variant support
    private Boolean hasVariants = false;
    private String variantData; // JSON string for variant configuration

}

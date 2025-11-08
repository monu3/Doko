package org.com.meropasal.meropasalbackend.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Created On : 2025 20 Jul 8:25 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WishlistItemDTO {

    private UUID id;
    private UUID productId;
    private String productName;
    private String productImage;
    private List<String> productImages;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private BigDecimal discountPercentage;
    private String description;
    private UUID shopId;
    private String shopName;
    private Integer stockQuantity;
    private String category;
    private String brandName;
    private LocalDateTime createdAt;
}

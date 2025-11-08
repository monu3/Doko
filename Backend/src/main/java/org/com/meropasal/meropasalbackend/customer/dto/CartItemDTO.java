package org.com.meropasal.meropasalbackend.customer.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Created On : 2025 20 Jul 6:48 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemDTO {

    private UUID id;
    private UUID productId;
    private String productName;
    private String productImage;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private BigDecimal discountPercentage;
    private Integer quantity;
    private BigDecimal totalPrice;
    private String selectedVariant;
    private UUID shopId;
    private String shopName;
    private String shopLogo;
    private Integer stockQuantity;
    private LocalDateTime createdAt;

}

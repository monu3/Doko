package org.com.meropasal.meropasalbackend.order.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Created On : 2025 22 Jul 4:41 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
public class OrderItemResponseDTO {
    private UUID productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private BigDecimal discountPrice;
    private BigDecimal discountPercentage;
    private String variant;
}

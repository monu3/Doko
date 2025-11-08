package org.com.meropasal.meropasalbackend.order.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Created On : 2025 22 Jul 4:37 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Getter
@Setter
@Builder
public class OrderItemRequestDTO {

    private String productId;

    private int quantity;

    private BigDecimal unitPrice;

    private String variant;
}

package org.com.meropasal.meropasalbackend.customer.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * Created On : 2025 20 Jul 8:26 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartSummaryDTO {

    private long totalItems;
    private BigDecimal totalAmount;

}

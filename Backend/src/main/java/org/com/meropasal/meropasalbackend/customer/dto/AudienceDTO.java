package org.com.meropasal.meropasalbackend.customer.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * Created On : 2025 02 Sep 11:39 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AudienceDTO {

    private String customerName;
    private String mobileNumber;
    private String email;
    private String city;
    private Long totalOrders;   // total number of orders
    private BigDecimal totalSales;  // total sales amount
}

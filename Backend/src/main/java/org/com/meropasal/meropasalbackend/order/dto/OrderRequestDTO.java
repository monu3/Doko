package org.com.meropasal.meropasalbackend.order.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.address.dto.ShippingAddressDTO;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created On : 2025 22 Jul 4:33 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Getter
@Setter
@Builder
public class OrderRequestDTO {

    private String shopId;


    private List<OrderItemRequestDTO> items;

    private ShippingAddressDTO shippingAddress;

    private PaymentMethod paymentMethod;

    @DecimalMin("0.01")
    private BigDecimal subtotal;

    @DecimalMin("0.00")
    private BigDecimal deliveryFee;

    @DecimalMin("0.01")
    private BigDecimal total;
}

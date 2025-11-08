package org.com.meropasal.meropasalbackend.order.dto;

import lombok.Getter;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.address.dto.ShippingAddressDTO;
import org.com.meropasal.meropasalbackend.order.enums.OrderStatus;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Created On : 2025 22 Jul 4:40 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
public class OrderResponseDTO {
    private UUID id;
    private String orderNumber;
    private String customerName;
    private String shopName;
    private String shopId;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal total;
    private BigDecimal originalTotal; // For showing original total
    private String channel;          // Order channel (Online, etc.)
    private ShippingAddressDTO shippingAddress;
    private List<OrderItemResponseDTO> items;
}

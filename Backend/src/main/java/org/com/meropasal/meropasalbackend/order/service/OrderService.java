package org.com.meropasal.meropasalbackend.order.service;

import org.com.meropasal.meropasalbackend.address.dto.ShippingAddressDTO;
import org.com.meropasal.meropasalbackend.address.entity.ShippingAddress;
import org.com.meropasal.meropasalbackend.customer.dto.CartItemDTO;
import org.com.meropasal.meropasalbackend.customer.entity.CustomerDetails;
import org.com.meropasal.meropasalbackend.customer.repo.CustomerRepository;
import org.com.meropasal.meropasalbackend.customer.service.CartService;
import org.com.meropasal.meropasalbackend.order.dto.OrderItemResponseDTO;
import org.com.meropasal.meropasalbackend.order.dto.OrderRequestDTO;
import org.com.meropasal.meropasalbackend.order.dto.OrderResponseDTO;
import org.com.meropasal.meropasalbackend.order.entity.Order;
import org.com.meropasal.meropasalbackend.order.entity.OrderItem;
import org.com.meropasal.meropasalbackend.order.enums.OrderStatus;
import org.com.meropasal.meropasalbackend.order.repo.OrderItemRepository;
import org.com.meropasal.meropasalbackend.order.repo.OrderRepository;
import org.com.meropasal.meropasalbackend.order.utils.OrderNumberGenerator;
import org.com.meropasal.meropasalbackend.product.repo.ProductRepository;
import org.com.meropasal.meropasalbackend.shop.repo.ShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final CartService cartService;
    private final OrderNumberGenerator orderNumberGenerator;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository, ShopRepository shopRepository, ProductRepository productRepository, CustomerRepository customerRepository, CartService cartService, OrderNumberGenerator orderNumberGenerator) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.cartService = cartService;
        this.orderNumberGenerator = orderNumberGenerator;
    }

    @Transactional
    public OrderResponseDTO createOrderFromCart(OrderRequestDTO orderRequest, UUID customerId) {
        CustomerDetails customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        List<CartItemDTO> cartItems = cartService.getCartItemsByShop(customerId, UUID.fromString(orderRequest.getShopId()));
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("No items found in cart for this shop");
        }

        Order order = new Order();
        order.setOrderNumber(orderNumberGenerator.generateUniqueOrderNumber());
        order.setCustomer(customer);
        order.setShop(shopRepository.findById(UUID.fromString(orderRequest.getShopId()))
                .orElseThrow(() -> new IllegalArgumentException("Shop not found")));
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setDeliveryFee(orderRequest.getDeliveryFee());

        ShippingAddress shippingAddress = new ShippingAddress();
        ShippingAddressDTO addressDTO = orderRequest.getShippingAddress();
        shippingAddress.setName(addressDTO.getName());
        shippingAddress.setEmail(addressDTO.getEmail());
        shippingAddress.setMobile(addressDTO.getMobile());
        shippingAddress.setCountry(addressDTO.getCountry());
        shippingAddress.setAddress(addressDTO.getAddress());
        shippingAddress.setCity(addressDTO.getCity());
        order.setShippingAddress(shippingAddress);

        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProduct(productRepository.findById(cartItem.getProductId())
                            .orElseThrow(() -> new IllegalArgumentException("Product not found: " + cartItem.getProductId())));
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setUnitPrice(cartItem.getPrice());
                    orderItem.setDiscountPrice(cartItem.getDiscountPrice());
                    orderItem.setDiscountPercentage(cartItem.getDiscountPercentage());
                    orderItem.setVariant(cartItem.getSelectedVariant());
                    orderItem.setProductImage(cartItem.getProductImage());
                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setItems(orderItems);
//        order.calculateTotals();

        Order savedOrder = orderRepository.save(order);
        cartService.clearCartItemsByShop(customerId, UUID.fromString(orderRequest.getShopId()));

        return mapToOrderResponseDTO(savedOrder);
    }

    public List<OrderResponseDTO> getOrdersByCustomer(UUID customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        return orders.stream()
                .map(this::mapToOrderResponseDTO)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO getOrderByIdAndCustomer(UUID orderId, UUID customerId) {
        Order order = orderRepository.findByIdAndCustomerId(orderId, customerId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found or does not belong to the customer"));
        return mapToOrderResponseDTO(order);
    }

    @Transactional
    public void cancelOrder(UUID orderId, UUID customerId) {
        Order order = orderRepository.findByIdAndCustomerId(orderId, customerId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found or does not belong to the customer"));

        if (!order.getStatus().equals(OrderStatus.PENDING)) {
            throw new IllegalStateException("Only pending orders can be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    private OrderResponseDTO mapToOrderResponseDTO(Order order) {
        OrderResponseDTO response = new OrderResponseDTO();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setCustomerName(order.getShippingAddress().getName());
        response.setShopName(order.getShop().getBusinessName());
        response.setShopId(String.valueOf(order.getShop().getId()));
        response.setStatus(order.getStatus());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setCreatedAt(order.getCreatedAt());
        response.setSubtotal(order.getSubtotal());
        response.setDeliveryFee(order.getDeliveryFee());
        response.setTotal(order.getTotal());
        response.setChannel(order.getChannel());

        ShippingAddressDTO addressDTO = new ShippingAddressDTO();
        ShippingAddress address = order.getShippingAddress();
        addressDTO.setName(address.getName());
        addressDTO.setEmail(address.getEmail());
        addressDTO.setMobile(address.getMobile());
        addressDTO.setCountry(address.getCountry());
        addressDTO.setAddress(address.getAddress());
        addressDTO.setCity(address.getCity());
        response.setShippingAddress(addressDTO);

        List<OrderItemResponseDTO> itemDTOs = order.getItems().stream()
                .map(this::mapToOrderItemResponseDTO)
                .collect(Collectors.toList());
        response.setItems(itemDTOs);

        return response;
    }

    private OrderItemResponseDTO mapToOrderItemResponseDTO(OrderItem item) {
        OrderItemResponseDTO dto = new OrderItemResponseDTO();
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImage(item.getProductImage());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        dto.setDiscountPrice(item.getDiscountPrice());
        dto.setDiscountPercentage(item.getDiscountPercentage());
        dto.setVariant(item.getVariant());
        return dto;
    }

    public OrderResponseDTO updateOrderStatus(UUID orderId, OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderResponseDTO(updatedOrder);
    }

    public List<OrderResponseDTO> getOrdersByShop(UUID shopId) {

        List<Order> orders = orderRepository.findByShopId(shopId);
        return orders.stream()
                .map(this::mapToOrderResponseDTO)
                .collect(Collectors.toList());

    }
}

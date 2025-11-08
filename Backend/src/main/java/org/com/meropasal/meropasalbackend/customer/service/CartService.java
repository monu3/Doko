package org.com.meropasal.meropasalbackend.customer.service;

import jakarta.transaction.Transactional;
import org.com.meropasal.meropasalbackend.customer.dto.CartItemDTO;
import org.com.meropasal.meropasalbackend.customer.dto.CartSummaryDTO;
import org.com.meropasal.meropasalbackend.customer.entity.CartItem;
import org.com.meropasal.meropasalbackend.customer.entity.CustomerDetails;
import org.com.meropasal.meropasalbackend.customer.repo.CartItemRepository;
import org.com.meropasal.meropasalbackend.customer.repo.CustomerRepository;
import org.com.meropasal.meropasalbackend.product.entity.Product;
import org.com.meropasal.meropasalbackend.product.repo.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Created On : 2025 20 Jul 8:32 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Service
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, CustomerRepository customerRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public CartItemDTO addToCart(UUID customerId, UUID productId, Integer quantity, String selectedVariant) {
        CustomerDetails customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found or inactive"));

        // Check if item already exists in cart
        CartItem existingItem = cartItemRepository.findByCustomerIdAndProductId(customerId, productId)
                .orElse(null);

        if (existingItem != null) {
            // Update quantity
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setSelectedVariant(selectedVariant);
            existingItem = cartItemRepository.save(existingItem);
        } else {
            // Create new cart item
            CartItem cartItem = new CartItem();
            cartItem.setCustomer(customer);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setPrice(product.getPrice());
            cartItem.setSelectedVariant(selectedVariant);
            existingItem = cartItemRepository.save(cartItem);
        }

        return convertToDTO(existingItem);
    }

    public List<CartItemDTO> getCartItems(UUID customerId) {
        List<CartItem> cartItems = cartItemRepository.findByCustomerIdWithShopGrouping(customerId);
        return cartItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Map<UUID, List<CartItemDTO>> getCartItemsGroupedByShop(UUID customerId) {
        List<CartItem> cartItems = cartItemRepository.findByCustomerIdWithShopGrouping(customerId);

        return cartItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.groupingBy(CartItemDTO::getShopId));
    }

    public CartItemDTO updateCartItem(UUID customerId, UUID cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.save(cartItem);

        return convertToDTO(cartItem);
    }

    public void removeFromCart(UUID customerId, UUID cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(cartItem);
    }

    public void clearCart(UUID customerId) {
        cartItemRepository.deleteByCustomerId(customerId);
    }

    public CartSummaryDTO getCartSummary(UUID customerId) {
        List<CartItem> cartItems = cartItemRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);

        long totalItems = cartItems.size();
        BigDecimal totalAmount = cartItems.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartSummaryDTO.builder()
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }

    public long getCartItemsCount(UUID customerId) {
        return cartItemRepository.countByCustomerId(customerId);
    }

    // Add these methods to your existing CartService
    public List<CartItemDTO> getCartItemsByShop(UUID customerId, UUID shopId) {
        return cartItemRepository.findByCustomerIdAndShopId(customerId, shopId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void clearCartItemsByShop(UUID customerId, UUID shopId) {
        cartItemRepository.deleteByCustomerIdAndShopId(customerId, shopId);
    }

    private CartItemDTO convertToDTO(CartItem cartItem) {
        Product product = cartItem.getProduct();

        return CartItemDTO.builder()
                .id(cartItem.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productImage(product.getImageUrl())
                .price(product.getPrice())
                .discountPercentage(product.getDiscountPercentage())
                .discountPrice(product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice())
                .quantity(cartItem.getQuantity())
                .totalPrice(cartItem.getTotalPrice())
                .selectedVariant(cartItem.getSelectedVariant())
                .shopId(product.getShop().getId())
                .shopName(product.getShop().getBusinessName())
                .shopLogo(product.getShop().getLogoUrl() != null ? product.getShop().getLogoUrl() : "")
                .stockQuantity(product.getStock())
                .createdAt(cartItem.getCreatedAt())
                .build();
    }
}

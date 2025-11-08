package org.com.meropasal.meropasalbackend.customer.service;

import org.com.meropasal.meropasalbackend.customer.dto.WishlistItemDTO;
import org.com.meropasal.meropasalbackend.customer.entity.CustomerDetails;
import org.com.meropasal.meropasalbackend.customer.entity.WishlistItem;
import org.com.meropasal.meropasalbackend.customer.repo.CustomerRepository;
import org.com.meropasal.meropasalbackend.customer.repo.WishlistItemRepository;
import org.com.meropasal.meropasalbackend.product.entity.Product;
import org.com.meropasal.meropasalbackend.product.repo.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Created On : 2025 21 Jul 12:39 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Service
@Transactional
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public WishlistService(WishlistItemRepository wishlistItemRepository, ProductRepository productRepository, CustomerRepository customerRepository) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    public WishlistItemDTO addToWishlist(UUID customerId, UUID productId) {
        CustomerDetails customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if item already exists in wishlist
        Optional<WishlistItem> existingItem = wishlistItemRepository
                .findByCustomerIdAndProductId(customerId, productId);

        if (existingItem.isPresent()) {
            throw new RuntimeException("Product already in wishlist");
        }

        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setCustomer(customer);
        wishlistItem.setProduct(product);

        wishlistItem = wishlistItemRepository.save(wishlistItem);

        return convertToDTO(wishlistItem);
    }

    public List<WishlistItemDTO> getWishlistItems(UUID customerId) {
        List<WishlistItem> wishlistItems = wishlistItemRepository.findByCustomerIdWithProductAndShop(customerId);
        return wishlistItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void removeFromWishlist(UUID customerId, UUID productId) {
        WishlistItem wishlistItem = wishlistItemRepository.findByCustomerIdAndProductId(customerId, productId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        wishlistItemRepository.delete(wishlistItem);
    }

    public void clearWishlist(UUID customerId) {
        wishlistItemRepository.deleteByCustomerId(customerId);
    }

    public boolean isInWishlist(UUID customerId, UUID productId) {
        return wishlistItemRepository.existsByCustomerIdAndProductId(customerId, productId);
    }

    public long getWishlistItemsCount(UUID customerId) {
        return wishlistItemRepository.countByCustomerId(customerId);
    }

    private WishlistItemDTO convertToDTO(WishlistItem wishlistItem) {
        Product product = wishlistItem.getProduct();
        WishlistItemDTO dto = new WishlistItemDTO();

        dto.setId(wishlistItem.getId());
        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setProductImage(product.getImageUrl());
        dto.setPrice(product.getPrice());
        dto.setDiscountPercentage(product.getDiscountPercentage());
        dto.setDescription(product.getDescription());
        dto.setShopId(product.getShop().getId());
        dto.setShopName(product.getShop().getBusinessName());
        dto.setStockQuantity(product.getStock());
        dto.setCategory(String.valueOf(product.getCategory()));
        dto.setCreatedAt(wishlistItem.getCreatedAt());

        return dto;
    }


}

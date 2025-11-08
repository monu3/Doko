package org.com.meropasal.meropasalbackend.customer.repo;

import org.com.meropasal.meropasalbackend.customer.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 20 Jul 8:35 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    // Find all cart items for a specific customer
    List<CartItem> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);

    // Find cart item by customer and product
    Optional<CartItem> findByCustomerIdAndProductId(UUID customerId, UUID productId);

    // Count cart items for a customer
    long countByCustomerId(UUID customerId);

    // Delete all cart items for a customer
    void deleteByCustomerId(UUID customerId);

    // Add this to CartItemRepository
    @Query("SELECT ci FROM CartItem ci JOIN ci.product p JOIN p.shop s " +
            "WHERE ci.customer.id = :customerId AND s.id = :shopId")
    List<CartItem> findByCustomerIdAndShopId(@Param("customerId") UUID customerId,
                                             @Param("shopId") UUID shopId);

    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.customer.id = :customerId AND ci.product.shop.id = :shopId")
    void deleteByCustomerIdAndShopId(@Param("customerId") UUID customerId,
                                     @Param("shopId") UUID shopId);

//    void deleteByCustomerIdAndShopId(UUID customerId, UUID shopId);

    // Delete cart item by customer and product
    void deleteByCustomerIdAndProductId(UUID customerId, UUID productId);

    // Find cart items grouped by shop
    @Query("SELECT ci FROM CartItem ci " +
            "JOIN FETCH ci.product p " +
            "JOIN FETCH p.shop s " +
            "WHERE ci.customer.id = :customerId " +
            "ORDER BY s.businessName, ci.createdAt DESC")
    List<CartItem> findByCustomerIdWithShopGrouping(@Param("customerId") UUID customerId);

    // Get total cart value for a customer
    @Query("SELECT COALESCE(SUM(ci.totalPrice), 0) FROM CartItem ci WHERE ci.customer.id = :customerId")
    Double getTotalCartValue(@Param("customerId") UUID customerId);

    // Check if product exists in customer's cart
    boolean existsByCustomerIdAndProductId(UUID customerId, UUID productId);
}

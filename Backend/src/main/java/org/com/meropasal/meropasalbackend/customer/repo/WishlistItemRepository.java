package org.com.meropasal.meropasalbackend.customer.repo;

import org.com.meropasal.meropasalbackend.customer.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 21 Jul 12:36 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID> {

    List<WishlistItem> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);

    @Query("SELECT wi FROM WishlistItem wi JOIN FETCH wi.product p JOIN FETCH p.shop s WHERE wi.customer.id = :customerId ORDER BY wi.createdAt DESC")
    List<WishlistItem> findByCustomerIdWithProductAndShop(@Param("customerId") UUID customerId);

    Optional<WishlistItem> findByCustomerIdAndProductId(UUID customerId, UUID productId);

    void deleteByCustomerId(UUID customerId);

    void deleteByCustomerIdAndProductId(UUID customerId, UUID productId);

    long countByCustomerId(UUID customerId);

    boolean existsByCustomerIdAndProductId(UUID customerId, UUID productId);
}

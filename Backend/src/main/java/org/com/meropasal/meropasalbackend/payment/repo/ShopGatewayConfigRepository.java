package org.com.meropasal.meropasalbackend.payment.repo;

import org.com.meropasal.meropasalbackend.payment.entity.ShopGatewayConfig;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 05 Sep 11:46 AM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface ShopGatewayConfigRepository extends JpaRepository<ShopGatewayConfig, UUID> {
//    Optional<ShopGatewayConfig> findByShopIdAndPaymentMethod(UUID shopId, PaymentMethod type);
//
//    // Add this method
//    List<ShopGatewayConfig> findByShopId(UUID shopId);
//    boolean existsByShopIdAndPaymentMethod(UUID shopId, PaymentMethod paymentMethod);

    // Try this explicit query instead of method name derivation
    // Use JOIN FETCH to avoid LazyLoadingException
    @Query("SELECT c FROM ShopGatewayConfig c JOIN FETCH c.shop s WHERE s.id = :shopId AND c.paymentMethod = :paymentMethod AND c.deleted = false")
    Optional<ShopGatewayConfig> findByShopIdAndPaymentMethod(@Param("shopId") UUID shopId,
                                                             @Param("paymentMethod") PaymentMethod paymentMethod);

    @Query("SELECT c FROM ShopGatewayConfig c WHERE c.shop.id = :shopId AND c.deleted = false")
    List<ShopGatewayConfig> findByShopId(@Param("shopId") UUID shopId);

    @Query("SELECT COUNT(c) > 0 FROM ShopGatewayConfig c WHERE c.shop.id = :shopId AND c.paymentMethod = :paymentMethod AND c.deleted = false")
    boolean existsByShopIdAndPaymentMethod(@Param("shopId") UUID shopId,
                                           @Param("paymentMethod") PaymentMethod paymentMethod);
}

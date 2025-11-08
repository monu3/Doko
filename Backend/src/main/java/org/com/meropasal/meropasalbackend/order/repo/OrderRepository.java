package org.com.meropasal.meropasalbackend.order.repo;

import org.com.meropasal.meropasalbackend.customer.dto.AudienceDTO;
import org.com.meropasal.meropasalbackend.order.entity.Order;
import org.com.meropasal.meropasalbackend.order.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 22 Jul 4:49 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByCustomerId(UUID customerId);

    @Query("SELECT o FROM Order o WHERE o.shop.id = :shopId")
    List<Order> findByShopId(@Param("shopId") UUID shopId);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId AND o.status = :status")
    List<Order> findByCustomerAndStatus(@Param("customerId") UUID customerId,
                                        @Param("status") OrderStatus status);

    Optional<Order> findByIdAndCustomerId(UUID orderId, UUID customerId);


    boolean existsByOrderNumber(String orderNumber);

    @Query("""
        SELECT new org.com.meropasal.meropasalbackend.customer.dto.AudienceDTO(
            sa.name,
            sa.mobile,
            sa.email,
            sa.city,
            COUNT(o.id),
            SUM(o.total)
        )
        FROM Order o
        JOIN o.shippingAddress sa
        WHERE o.shop.id = :shopId
        GROUP BY sa.name, sa.mobile, sa.email, sa.city
    """)
    List<AudienceDTO> getAudienceDataByShop(@Param("shopId") UUID shopId);

}

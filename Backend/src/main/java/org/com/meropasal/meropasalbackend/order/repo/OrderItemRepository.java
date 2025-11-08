package org.com.meropasal.meropasalbackend.order.repo;

import org.com.meropasal.meropasalbackend.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Created On : 2025 22 Jul 4:52 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    List<OrderItem> findByOrderId(UUID orderId);
}

package org.com.meropasal.meropasalbackend.customer.service;

import org.com.meropasal.meropasalbackend.customer.dto.AudienceDTO;
import org.com.meropasal.meropasalbackend.order.repo.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Created On : 2025 02 Sep 11:54 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Service
public class AudienceService {

    private final OrderRepository orderRepository;

    public AudienceService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<AudienceDTO> getAudienceByShop(UUID shopId) {
        return orderRepository.getAudienceDataByShop(shopId);
    }
}

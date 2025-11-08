package org.com.meropasal.meropasalbackend.follower.service;

import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.customer.entity.CustomerDetails;
import org.com.meropasal.meropasalbackend.customer.repo.CustomerRepository;
import org.com.meropasal.meropasalbackend.follower.dto.FollowerRequestDTO;
import org.com.meropasal.meropasalbackend.follower.dto.FollowerResponseDTO;
import org.com.meropasal.meropasalbackend.follower.entity.Follower;
import org.com.meropasal.meropasalbackend.follower.repo.FollowerRepository;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.com.meropasal.meropasalbackend.shop.repo.ShopRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Created On : 2025 08 Jul 9:54 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Service
@Getter
@Setter
public class FollowerService {


    private final FollowerRepository followerRepository;
    private final CustomerRepository customerRepository;
    private final ShopRepository shopRepository;


    public FollowerService(FollowerRepository followerRepository, CustomerRepository customerRepository, ShopRepository shopRepository) {
        this.followerRepository = followerRepository;
        this.customerRepository = customerRepository;
        this.shopRepository = shopRepository;
    }

    @Transactional
    public FollowerResponseDTO followShop(FollowerRequestDTO dto) {
        if (followerRepository.existsByCustomerDetailsIdAndShopId(dto.getCustomerId(), dto.getShopId())) {
            throw new RuntimeException("Already following the shop.");
        }

        CustomerDetails customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Shop shop = shopRepository.findById(dto.getShopId())
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        Follower follower = new Follower();
        follower.setCustomerDetails(customer);
        follower.setShop(shop);

        Follower saved = followerRepository.save(follower);

        return mapToResponseDTO(saved);
    }

    @Transactional
    public void unfollowShop(FollowerRequestDTO dto) {
        Follower follower = followerRepository.findByCustomerDetailsIdAndShopId(dto.getCustomerId(), dto.getShopId())
                .orElseThrow(() -> new RuntimeException("Follow record not found"));

        followerRepository.delete(follower);
    }

    public long countFollowers(UUID shopId) {
        return followerRepository.countByShopId(shopId);
    }

    public List<String> getFollowedShopsByCustomer(UUID customerId) {
        // Return list of shop IDs that the customer is following
        // This should query your database and return the shopIds
        return followerRepository.findShopIdsByCustomerDetailsId(customerId);
    }

    private FollowerResponseDTO mapToResponseDTO(Follower follower) {
        FollowerResponseDTO dto = new FollowerResponseDTO();
        dto.setId(follower.getId());
        dto.setCustomerId(follower.getCustomerDetails().getId());
        dto.setShopId(follower.getShop().getId());
        dto.setFollowedAt(follower.getCreatedAt());
        return dto;
    }

}

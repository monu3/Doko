package org.com.meropasal.meropasalbackend.shop.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.com.meropasal.meropasalbackend.authSystem.entity.Users;
import org.com.meropasal.meropasalbackend.authSystem.repo.UsersRepository;
import org.com.meropasal.meropasalbackend.payment.entity.ShopGatewayConfig;
import org.com.meropasal.meropasalbackend.payment.enums.PaymentMethod;
import org.com.meropasal.meropasalbackend.payment.repo.ShopGatewayConfigRepository;
import org.com.meropasal.meropasalbackend.shop.dto.ShopDTO;
import org.com.meropasal.meropasalbackend.shop.dto.ShopThemeDTO;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.com.meropasal.meropasalbackend.shop.mapper.ShopMapper;
import org.com.meropasal.meropasalbackend.shop.repo.ShopRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Created On : 2025 09 Feb 12:43 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final UsersRepository usersRepository;
    private final ShopMapper shopMapper;
    private final ShopGatewayConfigRepository shopGatewayConfigRepository;

    public Shop createShop(ShopDTO shopDTO, UUID ownerId) {
        Users owner = usersRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Shop shop = new Shop();
        shop.setShopUrl(shopDTO.getShopUrl());
        shop.setBusinessName(shopDTO.getBusinessName());
        shop.setDistrict(shopDTO.getDistrict());
        shop.setProvince(shopDTO.getProvince());
        shop.setOwner(owner);

        return shopRepository.save(shop);
    }


    public Shop getShopByOwnerId(UUID ownerId) {
        return shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found for this owner"));
    }

    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    public String getOwnerIdByEmail(String email) {
        // Find the user by email (UserRepository is assumed to have a method to find by email)
        Users users = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        // Return the userId (assuming userId is the ownerId in your scenario)
        return users.getId().toString(); // Assuming 'getId' returns the userId
    }

    public Shop getShopByUrl(String shopUrl) {
        return shopRepository.findByShopUrl(shopUrl)
                .orElseThrow(()->new EntityNotFoundException("Shop not found for this shopUrl"));
    }

    public Shop updateTheme(UUID shopId, String theme) {
// Find the shop by ID
        Optional<Shop> optionalShop = shopRepository.findById(shopId);

        if (optionalShop.isPresent()) {
            Shop shop = optionalShop.get();

            // Update the theme
            shop.setTheme(theme);

            // Save the updated shop
            return shopRepository.save(shop);
        } else {
            throw new EntityNotFoundException("Shop with ID " + shopId + " not found");
        }
    }



    public List<ShopThemeDTO> getAllActiveShopsForGallery() {
        List<Shop> shops = shopRepository.findAllByActiveTrue();
        return shops.stream()
                .map(shopMapper::toThemeDTO)
                .collect(Collectors.toList());
    }

    // Partial update for any shop fields including address
    @Transactional
    public Shop updateShop(UUID shopId, ShopDTO shopDTO) {
        Shop existingShop = shopRepository.findById(shopId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        // Update only non-null fields from DTO
        if (shopDTO.getShopUrl() != null) {
            existingShop.setShopUrl(shopDTO.getShopUrl());
        }
        if (shopDTO.getBusinessName() != null) {
            existingShop.setBusinessName(shopDTO.getBusinessName());
        }
        if (shopDTO.getDistrict() != null) {
            existingShop.setDistrict(shopDTO.getDistrict());
        }
        if (shopDTO.getProvince() != null) {
            existingShop.setProvince(shopDTO.getProvince());
        }
        if (shopDTO.getLogoUrl() != null) {
            existingShop.setLogoUrl(shopDTO.getLogoUrl());
        }
        if (shopDTO.getAddress() != null) {
            existingShop.setAddress(ShopMapper.convertToAddress(shopDTO.getAddress()));
        }

        return shopRepository.save(existingShop);
    }


    public List<PaymentMethod> getActivePaymentMethods(UUID shopId) {
        return shopGatewayConfigRepository.findByShopId(shopId)
                .stream()
                .filter(config -> !config.isDeleted() && config.isActive()) // Check both deleted and active
                .map(ShopGatewayConfig::getPaymentMethod)
                .collect(Collectors.toList());
    }
}

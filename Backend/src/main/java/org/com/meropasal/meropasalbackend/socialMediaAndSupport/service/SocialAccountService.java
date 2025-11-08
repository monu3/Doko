package org.com.meropasal.meropasalbackend.socialMediaAndSupport.service;

import jakarta.persistence.EntityNotFoundException;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.com.meropasal.meropasalbackend.shop.repo.ShopRepository;
import org.com.meropasal.meropasalbackend.socialMediaAndSupport.dto.SocialAccountDTO;
import org.com.meropasal.meropasalbackend.socialMediaAndSupport.entity.SocialAccount;
import org.com.meropasal.meropasalbackend.socialMediaAndSupport.mapper.SocialAccountMapper;
import org.com.meropasal.meropasalbackend.socialMediaAndSupport.repo.SocialAccountRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Created On : 2025 25 Jun 3:43 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Service
public class SocialAccountService {


    private final SocialAccountRepository socialAccountRepository;
    private final ShopRepository shopRepository;
    private final SocialAccountMapper socialAccountMapper;

    public SocialAccountService(SocialAccountRepository socialAccountRepository, ShopRepository shopRepository, SocialAccountMapper socialAccountMapper) {
        this.socialAccountRepository = socialAccountRepository;
        this.shopRepository = shopRepository;
        this.socialAccountMapper = socialAccountMapper;
    }

    public SocialAccountDTO createSocialAccount(UUID shopId, SocialAccountDTO dto) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        if (socialAccountRepository.existsByShopId(shopId)) {
            throw new IllegalStateException("Shop already has social account");
        }

        SocialAccount socialAccount = socialAccountMapper.toEntity(dto);
        socialAccount.setShop(shop);
        SocialAccount saved = socialAccountRepository.save(socialAccount);
        return socialAccountMapper.toDto(saved);
    }

    public SocialAccountDTO getByShopId(UUID shopId) {
        SocialAccount socialAccount = socialAccountRepository.findByShopId(shopId)
                .orElseThrow(() -> new EntityNotFoundException("Social account not found"));
        return socialAccountMapper.toDto(socialAccount);
    }

    public SocialAccountDTO updateSocialAccount(UUID shopId, SocialAccountDTO dto) {
        SocialAccount socialAccount = socialAccountRepository.findByShopId(shopId)
                .orElseThrow(() -> new EntityNotFoundException("Social account not found"));

        // Manual update of fields
        if (dto.getSupportEmail() != null) {
            socialAccount.setSupportEmail(dto.getSupportEmail());
        }
        if (dto.getSupportPhone() != null) {
            socialAccount.setSupportPhone(dto.getSupportPhone());
        }
        if (dto.getFacebookLink() != null) {
            socialAccount.setFacebookLink(dto.getFacebookLink());
        }
        if (dto.getTiktokLink() != null) {
            socialAccount.setTiktokLink(dto.getTiktokLink());
        }
        if (dto.getInstagramLink() != null) {
            socialAccount.setInstagramLink(dto.getInstagramLink());
        }
        if (dto.getYoutubeLink() != null) {
            socialAccount.setYoutubeLink(dto.getYoutubeLink());
        }

        SocialAccount updated = socialAccountRepository.save(socialAccount);
        return socialAccountMapper.toDto(updated);
    }

}

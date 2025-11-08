package org.com.meropasal.meropasalbackend.socialMediaAndSupport.mapper;

import lombok.Builder;
import org.com.meropasal.meropasalbackend.socialMediaAndSupport.dto.SocialAccountDTO;
import org.com.meropasal.meropasalbackend.socialMediaAndSupport.entity.SocialAccount;
import org.springframework.stereotype.Component;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;

/**
 * Created On : 2025 25 Jun 3:30 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Component
public class SocialAccountMapper {

    public SocialAccountDTO toDto(SocialAccount socialAccount) {
        return SocialAccountDTO.builder()
                .id(socialAccount.getId())
                .supportEmail(socialAccount.getSupportEmail())
                .supportPhone(socialAccount.getSupportPhone())
                .facebookLink(socialAccount.getFacebookLink())
                .tiktokLink(socialAccount.getTiktokLink())
                .instagramLink(socialAccount.getInstagramLink())
                .youtubeLink(socialAccount.getYoutubeLink())
                .shopId(socialAccount.getShop() != null ? socialAccount.getShop().getId() : null)
                .build();
    }

    public SocialAccount toEntity(SocialAccountDTO dto) {
        SocialAccount socialAccount = new SocialAccount();
        socialAccount.setSupportEmail(dto.getSupportEmail());
        socialAccount.setSupportPhone(dto.getSupportPhone());
        socialAccount.setFacebookLink(dto.getFacebookLink());
        socialAccount.setTiktokLink(dto.getTiktokLink());
        socialAccount.setInstagramLink(dto.getInstagramLink());
        socialAccount.setYoutubeLink(dto.getYoutubeLink());

        // Set the shop reference if shopId is provided
        if (dto.getShopId() != null) {
            Shop shop = new Shop();
            shop.setId(dto.getShopId());
            socialAccount.setShop(shop);
        }

        return socialAccount;
    }
}

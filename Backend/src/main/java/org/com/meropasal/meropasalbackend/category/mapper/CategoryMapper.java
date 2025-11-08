package org.com.meropasal.meropasalbackend.category.mapper;

/**
 * Created On : 2025 11 Feb 3:26 PM
 * Author : Monu Siddiki
 * Description :
 **/

import org.com.meropasal.meropasalbackend.category.dto.CategoryDto;
import org.com.meropasal.meropasalbackend.category.entity.Category;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDto toDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .active(category.isActive())
                .name(category.getName())
                .categoryUrl(category.getCategoryUrl())
                .bannerUrl(category.getBannerUrl())
                .description(category.getDescription())
                .deleted(category.isDeleted())
                .createdAt(category.getCreatedAt())
                .shopId(category.getShop() != null ? category.getShop().getId() : null) // Only set shopId
                .build();
    }

    public Category toEntity(CategoryDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setCategoryUrl(dto.getCategoryUrl());
        category.setBannerUrl(dto.getBannerUrl());
        category.setDescription(dto.getDescription());
        category.setDeleted(dto.isDeleted());
        // Set the shopId directly
        if (dto.getShopId() != null) {
            Shop shop = new Shop();
            shop.setId(dto.getShopId());
            category.setShop(shop);
        }

        return category;
    }
}


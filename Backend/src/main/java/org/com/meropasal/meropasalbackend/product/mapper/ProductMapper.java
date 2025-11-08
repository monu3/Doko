package org.com.meropasal.meropasalbackend.product.mapper;

import jakarta.persistence.EntityNotFoundException;
import org.com.meropasal.meropasalbackend.category.repo.CategoryRepository;
import org.com.meropasal.meropasalbackend.product.dto.ProductDTO;
import org.com.meropasal.meropasalbackend.product.entity.Product;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.com.meropasal.meropasalbackend.category.entity.Category;
import org.com.meropasal.meropasalbackend.shop.repo.ShopRepository;

public class ProductMapper {

    /**
     * Converts a ProductDTO to a Product entity.
     * <p>
     * Ignores the id, createdAt, updatedAt, and deleted fields as they are managed elsewhere.
     *
     * @param dto the ProductDTO to convert
     * @return a new Product entity based on the DTO, or null if the DTO is null
     */
    public static Product toEntity(ProductDTO dto) {
        if (dto == null) {
            return null;
        }

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setDiscountPrice(dto.getDiscountPrice());
        product.setImageUrl(dto.getImageUrl());
        product.setImages(dto.getImages());
        product.setDiscountPercentage(dto.getDiscountPercentage());
        // ADDED: multiple images

        // Note: id, createdAt, updatedAt, and deleted are not set

        // Map the shop relationship using shopId from DTO
        if (dto.getShopId() != null) {
            Shop shop = new Shop();
            shop.setId(dto.getShopId());
            product.setShop(shop);
        }

        // Map the category relationship using categoryId from DTO (if provided)
        if (dto.getCategoryId() != null) {
            Category category = new Category();
            category.setId(dto.getCategoryId());
            product.setCategory(category);
        }
        // Handle variant data
        product.setHasVariants(dto.getHasVariants());
        product.setVariantData(dto.getVariantData());

        return product;


    }

    /**
     * Converts a Product entity to a ProductDTO.
     * <p>
     * Maps basic properties as well as the related shop and category ids.
     * Optionally, you can also map shop and category names if these fields are available.
     *
     * @param product the Product entity to convert
     * @return a new ProductDTO based on the entity, or null if the product is null
     */
    public static ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(product.getDiscountPrice());
        dto.setDiscountPercentage(product.getDiscountPercentage());
        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImageUrl());
        dto.setImages(product.getImages());
        dto.setActive(product.isActive());
        dto.setHasVariants(product.getHasVariants());
        dto.setVariantData(product.getVariantData());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        // Map relationship IDs only
        if (product.getShop() != null) {
            dto.setShopId(product.getShop().getId());
        }

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
        }

        return dto;
    }

    /**
     * Updates an existing Product entity with values from a ProductDTO.
     * <p>
     * Only updates basic fields and relationships. Fields like id, createdAt,
     * updatedAt, and deleted are not updated.
     *
     * @param product the existing Product entity to update
     * @param dto     the ProductDTO containing the new values
     */
    public static void updateEntity(Product product, ProductDTO dto, CategoryRepository categoryRepository, ShopRepository shopRepository) {
        if (dto == null || product == null) {
            return;
        }

        if (dto.getName() != null) {
            product.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            product.setDescription(dto.getDescription());
        }
        if (dto.getPrice() != null) {
            product.setPrice(dto.getPrice());
        }
        if (dto.getStock() != null) {
            product.setStock(dto.getStock());
        }
        if (dto.getDiscountPercentage() != null) {
            product.setDiscountPercentage(dto.getDiscountPercentage());
        }
        if (dto.getImageUrl() != null) {
            product.setImageUrl(dto.getImageUrl());
        }
        if (dto.getImages() != null) {
            product.setImages(dto.getImages());
        }
        if (dto.getHasVariants() != null) {
            product.setHasVariants(dto.getHasVariants());
        }
        if (dto.getVariantData() != null) {
            product.setVariantData(dto.getVariantData());
        }

        // Update the shop relationship if shopId is provided
        if (dto.getShopId() != null) {
            Shop shop = shopRepository.findById(dto.getShopId())
                    .orElseThrow(() -> new EntityNotFoundException("Shop not found"));
            product.setShop(shop);
        }

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            product.setCategory(category);
        } else if (dto.getCategoryId() == null) {
            // Allow removing category
            product.setCategory(null);
        }
    }
}

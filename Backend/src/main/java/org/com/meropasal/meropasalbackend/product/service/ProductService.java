package org.com.meropasal.meropasalbackend.product.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.com.meropasal.meropasalbackend.category.entity.Category;
import org.com.meropasal.meropasalbackend.category.repo.CategoryRepository;
import org.com.meropasal.meropasalbackend.product.dto.ProductDTO;
import org.com.meropasal.meropasalbackend.product.entity.Product;
import org.com.meropasal.meropasalbackend.product.mapper.ProductMapper;
import org.com.meropasal.meropasalbackend.product.repo.ProductRepository;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.com.meropasal.meropasalbackend.shop.repo.ShopRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, ShopRepository shopRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.shopRepository = shopRepository;
        this.categoryRepository = categoryRepository;
    }

    // Note: The ProductMapper dependency is removed because we use its static methods directly.

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        try {
            // Convert DTO to entity using the static method
            Product product = ProductMapper.toEntity(productDTO);

            // Set the shop and category relationships based on IDs from the DTO
            setRelationships(product, productDTO);

            // Validate variant data if hasVariants is true
            if (Boolean.TRUE.equals(productDTO.getHasVariants())) {
                validateVariantData(productDTO.getVariantData());
            }

            // Save and convert back to DTO
            Product savedProduct = productRepository.save(product);
            return ProductMapper.toDTO(savedProduct);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error creating product: " + e.getMessage());
        }
    }

    @Transactional
    public ProductDTO updateProduct(UUID id, ProductDTO productDTO) {
        try {
            Product existingProduct = productRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));

            // Validate variant data if hasVariants is being set to true
            if (Boolean.TRUE.equals(productDTO.getHasVariants())) {
                validateVariantData(productDTO.getVariantData());
            }

            // Update entity fields from DTO using the static mapper method
            ProductMapper.updateEntity(existingProduct, productDTO, categoryRepository, shopRepository);

            // Save and convert back to DTO
            Product updatedProduct = productRepository.save(existingProduct);
            return ProductMapper.toDTO(updatedProduct);

        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error updating product: " + e.getMessage());
        }
    }

    @Transactional
    public ProductDTO updateProductStatus(UUID id, boolean active) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with ID: " + id));

        product.setActive(active);  // Update the 'active' field
        Product updated = productRepository.save(product);
        return ProductMapper.toDTO(updated);  // Convert to DTO and return
    }

    @Transactional
    public void deleteProduct(UUID id) {
        productRepository.deleteById(id);
    }

    @Transactional
    public ProductDTO getProductById(UUID id) {
        return productRepository.findByIdAndDeletedFalse(id)
                .map(ProductMapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    public List<ProductDTO> getProductsByShopId(UUID shopId) {
        return productRepository.findAllByShopId(shopId).stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByCategoryId(UUID categoryId) {
        return productRepository.findAllByCategoryId(categoryId).stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Sets up the shop and category relationships in the product entity based on the IDs in the DTO.
     *
     * @param product the product entity to update
     * @param dto     the DTO containing the shop and category IDs
     */
    private void setRelationships(Product product, ProductDTO dto) {
        // Fetch and set the shop using the shopId from the DTO
        Shop shop = shopRepository.findById(dto.getShopId())
                .orElseThrow(() -> new EntityNotFoundException("Shop not found"));
        product.setShop(shop);

        // If a categoryId is provided, fetch and set the category; otherwise, leave it unset.
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            product.setCategory(category);
        }
    }


    /**
     * Validates that variant data is properly formatted JSON when hasVariants is true
     */
    private void validateVariantData(String variantData) {
        if (variantData == null || variantData.trim().isEmpty()) {
            throw new IllegalArgumentException("Variant data is required when hasVariants is true");
        }

        try {
            // Basic JSON validation - you can enhance this with schema validation
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            mapper.readTree(variantData);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid variant data format: " + e.getMessage());
        }
    }
}

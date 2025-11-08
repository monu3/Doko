package org.com.meropasal.meropasalbackend.category.service;

/**
 * Created On : 2025 11 Feb 3:27 PM
 * Author : Monu Siddiki
 * Description :
 **/

import lombok.RequiredArgsConstructor;
import org.com.meropasal.meropasalbackend.category.dto.CategoryDto;
import org.com.meropasal.meropasalbackend.category.entity.Category;
import org.com.meropasal.meropasalbackend.category.mapper.CategoryMapper;
import org.com.meropasal.meropasalbackend.category.repo.CategoryRepository;
import org.com.meropasal.meropasalbackend.product.repo.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final ProductRepository productRepository;

    // Get all categories
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();

        // Fetch product counts once
        List<Object[]> countsList = productRepository.countProductsByCategory();
        Map<UUID, Long> counts = countsList.stream()
                .collect(Collectors.toMap(
                        row -> UUID.fromString(row[0].toString()),
                        row -> (Long) row[1]
                ));

        return categories.stream()
                .map(category -> {
                    CategoryDto dto = categoryMapper.toDto(category);
                    dto.setProductCount(counts.getOrDefault(category.getId(), 0L)); // ✅ attach count
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Get a category by ID
    public CategoryDto getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with ID: " + id));
        return categoryMapper.toDto(category);
    }

    // Create a new category
    public CategoryDto createCategory(CategoryDto categoryDto) {

        Category category = categoryMapper.toEntity(categoryDto);
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toDto(savedCategory);
    }

    // Update an existing category
    public CategoryDto updateCategory(UUID id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with ID: " + id));

        category.setName(categoryDto.getName());
        category.setCategoryUrl(categoryDto.getCategoryUrl());
        category.setBannerUrl(categoryDto.getBannerUrl());
        category.setDescription(categoryDto.getDescription());

        Category updatedCategory = categoryRepository.save(category);
        return categoryMapper.toDto(updatedCategory);
    }

    @Transactional
    public CategoryDto updateCategoryStatus(UUID id, boolean active) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with ID: " + id));

        category.setActive(active);  // Update the 'active' field
        Category updated = categoryRepository.save(category);
        return categoryMapper.toDto(updated);  // Convert to DTO and return
    }


    // Soft delete category (marks it as deleted)
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with ID: " + id));
        category.setDeleted(true);
        categoryRepository.save(category);
    }


    /**
     * Get all categories by shopId
     *
     * @param shopId UUID of the shop
     * @return List<CategoryDto>
     */
    public List<CategoryDto> getCategoriesByShopId(UUID shopId) {
        List<Category> categories = categoryRepository.findByShopId(shopId);

        List<Object[]> countsList = productRepository.countProductsByCategory();
        Map<UUID, Long> counts = countsList.stream()
                .collect(Collectors.toMap(
                        row -> UUID.fromString(row[0].toString()),
                        row -> (Long) row[1]
                ));

        return categories.stream()
                .map(category -> {
                    CategoryDto dto = categoryMapper.toDto(category);
                    dto.setProductCount(counts.getOrDefault(category.getId(), 0L));
                    return dto;
                })
                .collect(Collectors.toList());
    }


}


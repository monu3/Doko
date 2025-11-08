package org.com.meropasal.meropasalbackend.category.controller;

/**
 * Created On : 2025 11 Feb 3:28 PM
 * Author : Monu Siddiki
 * Description :
 **/
import lombok.RequiredArgsConstructor;
import org.com.meropasal.meropasalbackend.category.dto.CategoryDto;
import org.com.meropasal.meropasalbackend.category.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SHOP_OWNER')")
public class CategoryController {

    private final CategoryService categoryService;


    // Get all categories
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    /**
     * Get categories by shopId
     * @param shopId UUID of the shop
     * @return List<CategoryDto>
     */
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<CategoryDto>> getCategoriesByShop(@PathVariable UUID shopId) {
        List<CategoryDto> categories = categoryService.getCategoriesByShopId(shopId);
        return ResponseEntity.ok(categories);
    }

    // Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // Create a new category
    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        return new ResponseEntity<>(categoryService.createCategory(categoryDto), HttpStatus.CREATED);
    }

    // Update category
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable UUID id, @RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(categoryService.updateCategory(id, categoryDto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CategoryDto> updateCategoryStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> statusRequest) {
        boolean active = statusRequest.get("active");
        return ResponseEntity.ok(categoryService.updateCategoryStatus(id, active));
    }

    // Soft delete category
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully!");
    }
}


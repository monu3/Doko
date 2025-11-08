package org.com.meropasal.meropasalbackend.product.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.com.meropasal.meropasalbackend.category.dto.CategoryDto;
import org.com.meropasal.meropasalbackend.product.dto.ProductDTO;
import org.com.meropasal.meropasalbackend.product.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 09 Feb 11:44 AM
 * Author : Monu Siddiki
 * Description :
 **/
// ProductController.java
@RestController
@RequestMapping("/products")
@PreAuthorize("hasAnyRole('SHOP_OWNER')")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        return new ResponseEntity<>(productService.createProduct(productDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(id, productDTO));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProductDTO> updateProductStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> statusRequest) {
        boolean active = statusRequest.get("active");
        return ResponseEntity.ok(productService.updateProductStatus(id, active));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<ProductDTO>> getProductsByShopId(@PathVariable UUID shopId) {
        return ResponseEntity.ok(productService.getProductsByShopId(shopId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategoryId(@PathVariable UUID categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategoryId(categoryId));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}

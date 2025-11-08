package org.com.meropasal.meropasalbackend.product.repo;

import org.com.meropasal.meropasalbackend.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 08 Feb 9:57 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findAllByShopId(UUID shopId);
    List<Product> findAllByCategoryId(UUID categoryId);
    Optional<Product> findByIdAndDeletedFalse(UUID id);

    @Query("SELECT p.category.id, COUNT(p) " +
            "FROM Product p " +
            "WHERE p.deleted = false " +
            "GROUP BY p.category.id")
    List<Object[]> countProductsByCategory();
}

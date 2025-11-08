package org.com.meropasal.meropasalbackend.category.repo;

import org.com.meropasal.meropasalbackend.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Created On : 2025 08 Feb 10:49 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    // Custom query to find categories by shopId
    List<Category> findByShopId(UUID shopId);
}

package org.com.meropasal.meropasalbackend.shop.repo;

import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 08 Feb 10:46 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface ShopRepository extends JpaRepository<Shop, UUID> {

    Optional<Shop> findByOwnerId(UUID ownerId);

    Optional<Shop> findByShopUrl(String shopUrl);

    List<Shop> findAllByActiveTrue();
}

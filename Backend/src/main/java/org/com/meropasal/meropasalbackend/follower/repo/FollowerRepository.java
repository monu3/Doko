package org.com.meropasal.meropasalbackend.follower.repo;

import org.com.meropasal.meropasalbackend.follower.entity.Follower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 08 Jul 9:49 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface FollowerRepository extends JpaRepository<Follower, UUID> {

    boolean existsByCustomerDetailsIdAndShopId(UUID customerId, UUID shopId);

    Optional<Follower> findByCustomerDetailsIdAndShopId(UUID customerId, UUID shopId);

    long countByShopId(UUID shopId);

    List<Follower> findByShopId(UUID shopId);

    @Query("SELECT f.shop.id FROM Follower f WHERE f.customerDetails.id = :customerId")
    List<String> findShopIdsByCustomerDetailsId(@Param("customerId") UUID customerId);

}

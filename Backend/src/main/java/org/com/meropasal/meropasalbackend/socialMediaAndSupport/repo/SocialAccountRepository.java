package org.com.meropasal.meropasalbackend.socialMediaAndSupport.repo;

import org.com.meropasal.meropasalbackend.socialMediaAndSupport.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 25 Jun 3:40 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface SocialAccountRepository extends JpaRepository<SocialAccount, UUID> {

    Optional<SocialAccount> findByShopId(UUID shopId);
    boolean existsByShopId(UUID shopId);
}

package org.com.meropasal.meropasalbackend.customer.repo;

import org.com.meropasal.meropasalbackend.customer.entity.CustomerDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Created On : 2025 01 Jul 6:10 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Repository
public interface CustomerRepository extends JpaRepository<CustomerDetails, UUID> {

    Optional<CustomerDetails> findByEmail(String email);
    Optional<CustomerDetails> findByEmailAndVerifiedTrue(String email);

}

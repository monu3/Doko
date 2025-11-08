package org.com.meropasal.meropasalbackend.address.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

/**
 * Created On : 2025 22 Jul 4:16 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Embeddable
@Getter
@Setter
public class ShippingAddress {

    private String name;

    private String email;

    private String mobile;

    private String country;

    private String address;

    private String city;
}

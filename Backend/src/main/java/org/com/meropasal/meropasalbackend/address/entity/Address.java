package org.com.meropasal.meropasalbackend.address.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

/**
 * Created On : 2025 23 Jun 10:41 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Embeddable
@Getter
@Setter
public class Address {

    private String street;

    private String tole;

    private String city;

    private String postalCode;

    private String mapUrl; // Google Maps URL or coordinates
}

package org.com.meropasal.meropasalbackend.address.dto;

import lombok.*;

/**
 * Created On : 2025 22 Jul 4:38 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShippingAddressDTO {
    private String name;

    private String email;

    private String mobile;

    private String country;

    private String address;

    private String city;
}

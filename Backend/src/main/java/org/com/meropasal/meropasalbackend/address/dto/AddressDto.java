package org.com.meropasal.meropasalbackend.address.dto;

import lombok.Getter;
import lombok.Setter;
/**
 * Created On : 2025 24 Jun 12:59 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Getter
@Setter
public class AddressDto {
    private String street;
    private String tole;
    private String city;
    private String postalCode;
    private String mapUrl;

}

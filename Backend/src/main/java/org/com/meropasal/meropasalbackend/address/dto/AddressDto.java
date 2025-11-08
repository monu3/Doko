package org.com.meropasal.meropasalbackend.address.dto;

import lombok.Getter;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.address.entity.Address;

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


    public Address toEmbeddable() {
        Address address = new Address();
        address.setStreet(this.street);
        address.setTole(this.tole);
        address.setCity(this.city);
        address.setPostalCode(this.postalCode);
        address.setMapUrl(this.mapUrl);
        return address;
    }
}

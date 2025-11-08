package org.com.meropasal.meropasalbackend.shop.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.address.dto.AddressDto;
import org.com.meropasal.meropasalbackend.shop.enums.District;
import org.com.meropasal.meropasalbackend.shop.enums.Province;

/**
 * Created On : 2025 05 Feb 11:41 AM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShopDTO {

    @Size(min = 3, max = 50)
    private String shopUrl;

    @Size(max = 100)
    private String businessName;

    @Size(max = 100)
    private String theme;

    private String logoUrl;

    private District district;
    private Province province;

    private AddressDto address;

}
